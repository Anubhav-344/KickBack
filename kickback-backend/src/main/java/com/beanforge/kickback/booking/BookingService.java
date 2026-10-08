package com.beanforge.kickback.booking;

import com.beanforge.kickback.booking.dto.BookingResponse;
import com.beanforge.kickback.booking.dto.BookingSummaryResponse;
import com.beanforge.kickback.booking.dto.CancelBookingResponse;
import com.beanforge.kickback.booking.dto.CreateBookingRequest;
import com.beanforge.kickback.booking.dto.UpdateBookingOfferRequest;
import com.beanforge.kickback.entity.Booking;
import com.beanforge.kickback.entity.Cafe;
import com.beanforge.kickback.entity.Game;
import com.beanforge.kickback.entity.Offer;
import com.beanforge.kickback.entity.OperatingDay;
import com.beanforge.kickback.entity.Resource;
import com.beanforge.kickback.entity.User;
import com.beanforge.kickback.enums.BookingStatus;
import com.beanforge.kickback.enums.DayOfWeekEnum;
import com.beanforge.kickback.enums.DiscountType;
import com.beanforge.kickback.enums.OfferType;
import com.beanforge.kickback.repository.BookingRepository;
import com.beanforge.kickback.repository.GameRepository;
import com.beanforge.kickback.repository.OfferRepository;
import com.beanforge.kickback.repository.ResourceRepository;
import com.beanforge.kickback.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final GameRepository gameRepository;
    private final OfferRepository offerRepository;
    private final UserRepository userRepository;

    @Value("${app.booking.hold-minutes:10}")
    private long holdMinutes;

    @Value("${app.booking.tax-rate:0}")
    private BigDecimal taxRate;

    public BookingService(
            BookingRepository bookingRepository,
            ResourceRepository resourceRepository,
            GameRepository gameRepository,
            OfferRepository offerRepository,
            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.gameRepository = gameRepository;
        this.offerRepository = offerRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse createBooking(Authentication authentication, CreateBookingRequest request) {
        User user = getAuthenticatedUser(authentication);
        LocalDateTime now = LocalDateTime.now();

        if (request.getStartTimestamp().isBefore(now)) {
            throw badRequest("Booking start time must be in the future");
        }
        if (!request.getStartTimestamp().isBefore(request.getEndTimestamp())) {
            throw badRequest("Start time must be before end time");
        }
        if (!request.getDate().equals(request.getStartTimestamp().toLocalDate())
                || !request.getDate().equals(request.getEndTimestamp().toLocalDate())) {
            throw badRequest("Booking date must match the start and end dates");
        }

        // PESSIMISTIC_WRITE lock acquired here, held for the rest of this
        // transaction — this is what actually prevents the double-booking
        // race, not the overlap check below on its own. See
        // ResourceRepository.findByIdForUpdate for the full explanation.
        Resource resource = resourceRepository.findByIdForUpdate(request.getResourceId())
                .orElseThrow(() -> notFound("Resource not found"));
        Cafe cafe = resource.getCafe();

        validateResource(resource);
        validateOperatingHours(cafe, request.getDate(),
                request.getStartTimestamp().toLocalTime(), request.getEndTimestamp().toLocalTime());

        long requestedDurationMinutes = Duration.between(
                request.getStartTimestamp(), request.getEndTimestamp()).toMinutes();
        if (requestedDurationMinutes <= 0) {
            throw badRequest("Booking duration must be greater than zero");
        }

        Game game = resolveGame(resource, request.getGameId());
        Offer offer = resolveOffer(cafe, request.getOfferId(), request.getPromoCode());
        validateOfferEligibility(offer, request.getDate(), request.getStartTimestamp().toLocalTime(),
                requestedDurationMinutes);

        LocalDateTime finalEndTimestamp = request.getEndTimestamp();
        if (offer != null && offer.getOfferType() == OfferType.EXTRA_TIME) {
            int bonusMinutes = offer.getBonusMinutes() == null ? 0 : offer.getBonusMinutes();
            if (bonusMinutes > 0) {
                finalEndTimestamp = finalEndTimestamp.plusMinutes(bonusMinutes);
                validateOperatingHours(cafe, request.getDate(),
                        request.getStartTimestamp().toLocalTime(), finalEndTimestamp.toLocalTime());
            }
        }

        // Safe from races now: the PESSIMISTIC_WRITE lock above means any
        // other transaction trying to book this same resource is blocked
        // until this one commits or rolls back — so by the time we check
        // for overlaps here, no concurrent request can sneak in ahead of us.
        if (bookingRepository.existsOverlappingBooking(
                resource.getResourceId(),
                request.getStartTimestamp(),
                finalEndTimestamp,
                BookingStatus.PENDING,
                BookingStatus.CONFIRMED,
                now)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "The selected resource is already booked for the requested time");
        }

        // Bonus time is free; discount offers affect the requested booking price.
        BigDecimal hourlyRate = resource.getHourlyRate();
        BigDecimal subtotal = hourlyRate
                .multiply(BigDecimal.valueOf(requestedDurationMinutes))
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

        BigDecimal discountAmount = calculateDiscount(offer, subtotal);
        BigDecimal taxableAmount = subtotal.subtract(discountAmount).max(BigDecimal.ZERO);
        BigDecimal taxAmount = taxableAmount
                .multiply(taxRate)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = taxableAmount.add(taxAmount).setScale(2, RoundingMode.HALF_UP);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setCafe(cafe);
        booking.setGame(game);
        booking.setStartTimestamp(request.getStartTimestamp());
        booking.setEndTimestamp(finalEndTimestamp);
        booking.setBookingStatus(BookingStatus.PENDING);
        booking.setHoldExpiresAt(now.plusMinutes(holdMinutes));
        booking.setNotes(request.getNotes());
        booking.setSubtotal(subtotal);
        booking.setDiscountAmount(discountAmount);
        booking.setTaxAmount(taxAmount);
        booking.setTotalAmount(totalAmount);

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public BookingResponse getBooking(Authentication authentication, Long bookingId) {
        User user = getAuthenticatedUser(authentication);
        Booking booking = bookingRepository.findByBookingIdAndUser_UserId(bookingId, user.getUserId())
                .orElseThrow(() -> notFound("Booking not found"));
        return toResponse(booking);
    }

    @Transactional
    public CancelBookingResponse cancelBooking(Authentication authentication, Long bookingId) {
        User user = getAuthenticatedUser(authentication);
        Booking booking = bookingRepository.findByBookingIdAndUser_UserId(bookingId, user.getUserId())
                .orElseThrow(() -> notFound("Booking not found"));

        if (booking.getBookingStatus() == BookingStatus.PENDING
                && booking.getHoldExpiresAt() != null
                && !booking.getHoldExpiresAt().isAfter(LocalDateTime.now())) {
            booking.setBookingStatus(BookingStatus.EXPIRED);
            booking.setHoldExpiresAt(null);
            bookingRepository.save(booking);
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Booking hold has expired");
        }

        if (booking.getBookingStatus() != BookingStatus.PENDING
                && booking.getBookingStatus() != BookingStatus.CONFIRMED) {
            throw badRequest("Only pending or confirmed bookings can be cancelled");
        }

        if (!booking.getStartTimestamp().isAfter(LocalDateTime.now())) {
            throw badRequest("A booking that has already started cannot be cancelled");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setHoldExpiresAt(null);
        Booking saved = bookingRepository.save(booking);

        return new CancelBookingResponse(saved.getBookingId(), saved.getBookingStatus());
    }

    /**
     * Sets, changes, or clears the offer on a still-PENDING booking, and
     * recalculates discount/tax/total accordingly. This exists because
     * CreateBookingRequest bakes offerId/promoCode into booking creation,
     * but the frontend's flow applies offers on the Preview page — AFTER
     * the hold already exists. Rather than forcing offer selection earlier
     * in the UX, a still-pending booking's offer can be updated here.
     *
     * EXTRA_TIME offers are intentionally rejected here: they extend
     * endTimestamp, which could newly overlap a booking made by someone
     * else for the adjacent slot after this hold was created — safely
     * re-validating that would need the same resource-row lock used in
     * createBooking. Scoped out for now; EXTRA_TIME must be chosen at
     * creation time, which the frontend can offer as a fallback.
     */
    @Transactional
    public BookingResponse updateBookingOffer(
            Authentication authentication, Long bookingId, UpdateBookingOfferRequest request) {

        User user = getAuthenticatedUser(authentication);
        Booking booking = bookingRepository.findByBookingIdAndUser_UserId(bookingId, user.getUserId())
                .orElseThrow(() -> notFound("Booking not found"));

        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw badRequest("Only pending bookings can be updated");
        }

        LocalDateTime now = LocalDateTime.now();
        if (booking.getHoldExpiresAt() == null || !booking.getHoldExpiresAt().isAfter(now)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Booking hold has expired");
        }

        Cafe cafe = booking.getCafe();
        Offer offer = resolveOffer(cafe, request.getOfferId(), request.getPromoCode());

        if (offer != null && offer.getOfferType() == OfferType.EXTRA_TIME) {
            throw badRequest("This offer type must be selected when creating the booking");
        }

        long durationMinutes = Duration.between(
                booking.getStartTimestamp(), booking.getEndTimestamp()).toMinutes();
        validateOfferEligibility(
                offer, booking.getStartTimestamp().toLocalDate(),
                booking.getStartTimestamp().toLocalTime(), durationMinutes);

        BigDecimal discountAmount = calculateDiscount(offer, booking.getSubtotal());
        BigDecimal taxableAmount = booking.getSubtotal().subtract(discountAmount).max(BigDecimal.ZERO);
        BigDecimal taxAmount = taxableAmount
                .multiply(taxRate)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = taxableAmount.add(taxAmount).setScale(2, RoundingMode.HALF_UP);

        booking.setDiscountAmount(discountAmount);
        booking.setTaxAmount(taxAmount);
        booking.setTotalAmount(totalAmount);

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingSummaryResponse> getMyBookings(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        // EXPIRED = an unpaid hold that lapsed. The user never actually had
        // that booking (no payment, slot already released), so listing it
        // under "Past" is just clutter. The rows stay in the database.
        return bookingRepository.findByUser_UserIdOrderByStartTimestampDesc(user.getUserId())
                .stream()
                .filter(booking -> booking.getBookingStatus() != BookingStatus.EXPIRED)
                .map(this::toSummaryResponse)
                .toList();
    }

    /**
     * Runs every minute. Two responsibilities:
     *  1. PENDING bookings whose hold window expired without ever being
     *     paid for become EXPIRED — previously this only happened reactively
     *     (e.g. if someone tried to cancel or pay for one), so a booking
     *     that was simply abandoned stayed PENDING forever from the user's
     *     point of view, even though it was already correctly excluded from
     *     the overlap check (existsOverlappingBooking already ignores
     *     PENDING bookings past their holdExpiresAt — this job just makes
     *     that state visible/consistent in My Bookings too).
     *  2. CONFIRMED bookings whose session time has passed become
     *     COMPLETED — required for the review feature, since reviews can
     *     only be left on COMPLETED bookings.
     */
    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void processBookingLifecycle() {
        LocalDateTime now = LocalDateTime.now();

        List<Booking> expiredHolds =
                bookingRepository.findByBookingStatusAndHoldExpiresAtBefore(BookingStatus.PENDING, now);
        for (Booking booking : expiredHolds) {
            booking.setBookingStatus(BookingStatus.EXPIRED);
            booking.setHoldExpiresAt(null);
        }
        bookingRepository.saveAll(expiredHolds);

        List<Booking> toComplete =
                bookingRepository.findByBookingStatusAndEndTimestampBefore(BookingStatus.CONFIRMED, now);
        for (Booking booking : toComplete) {
            booking.setBookingStatus(BookingStatus.COMPLETED);
        }
        bookingRepository.saveAll(toComplete);
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }
        try {
            Long userId = Long.valueOf(authentication.getName());
            User found = userRepository.findById(userId)
                    .orElseThrow(() -> notFound("User not found"));
            if (found.isDeleted()) {
                // A token issued before the account was deleted is still
                // cryptographically valid; this is what stops it working.
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account no longer exists");
            }
            return found;
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authenticated user");
        }
    }

    private void validateResource(Resource resource) {
        if (resource.getStatus() != null && resource.getStatus().name().equalsIgnoreCase("INACTIVE")) {
            throw badRequest("The selected resource is not available for booking");
        }
        if (resource.getHourlyRate() == null || resource.getHourlyRate().compareTo(BigDecimal.ZERO) < 0) {
            throw badRequest("Resource hourly rate is invalid");
        }
    }

    private Game resolveGame(Resource resource, Long gameId) {
        if (gameId == null) return null;
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> notFound("Game not found"));
        boolean supported = resource.getGames().stream()
                .anyMatch(g -> g.getGameId().equals(game.getGameId()));
        if (!supported) {
            throw badRequest("Selected game is not available on this resource");
        }
        return game;
    }

    private void validateOperatingHours(Cafe cafe, LocalDate date, LocalTime startTime, LocalTime endTime) {
        DayOfWeekEnum requestedDay = toDayOfWeekEnum(date.getDayOfWeek());
        OperatingDay operatingDay = cafe.getOperatingDays().stream()
                .filter(day -> day.getDaysOfWeek() == requestedDay)
                .findFirst()
                .orElseThrow(() -> badRequest("Operating hours are not configured for this day"));

        if (Boolean.TRUE.equals(operatingDay.getIsClosed())) {
            throw badRequest("The cafe is closed on the selected date");
        }
        LocalTime openingTime = operatingDay.getOpeningTime();
        LocalTime closingTime = operatingDay.getClosingTime();
        if (openingTime == null || closingTime == null) {
            throw badRequest("Operating hours are not configured for the selected date");
        }
        if (startTime.isBefore(openingTime) || endTime.isAfter(closingTime)) {
            throw badRequest("Booking time is outside the cafe operating hours");
        }
    }

    private DayOfWeekEnum toDayOfWeekEnum(java.time.DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> DayOfWeekEnum.MON;
            case TUESDAY -> DayOfWeekEnum.TUE;
            case WEDNESDAY -> DayOfWeekEnum.WED;
            case THURSDAY -> DayOfWeekEnum.THU;
            case FRIDAY -> DayOfWeekEnum.FRI;
            case SATURDAY -> DayOfWeekEnum.SAT;
            case SUNDAY -> DayOfWeekEnum.SUN;
        };
    }

    // Primitive-based so both createBooking (from CreateBookingRequest's
    // fields) and updateBookingOffer (from an existing Booking's own
    // fields) can share this exact same resolution/validation logic.
    private Offer resolveOffer(Cafe cafe, Long offerId, String promoCode) {
        if (offerId == null && (promoCode == null || promoCode.isBlank())) return null;

        Offer offer;
        if (offerId != null) {
            offer = offerRepository.findById(offerId)
                    .orElseThrow(() -> notFound("Offer not found"));
            if (promoCode != null && !promoCode.isBlank()
                    && !promoCode.equalsIgnoreCase(offer.getPromoCode())) {
                throw badRequest("Offer ID and promo code do not match");
            }
        } else {
            offer = offerRepository.findByCafe_CafeIdAndPromoCodeIgnoreCase(
                            cafe.getCafeId(), promoCode.trim())
                    .orElseThrow(() -> badRequest("Invalid promo code"));
        }

        if (!offer.getCafe().getCafeId().equals(cafe.getCafeId())) {
            throw badRequest("The selected offer does not belong to this cafe");
        }
        return offer;
    }

    private void validateOfferEligibility(
            Offer offer, LocalDate date, LocalTime startTime, long requestedMinutes) {
        if (offer == null) return;
        if (!Boolean.TRUE.equals(offer.getIsActive())) throw badRequest("Offer is inactive");
        if (date.isBefore(offer.getValidFrom()) || date.isAfter(offer.getValidTo())) {
            throw badRequest("Offer is not valid on the selected date");
        }

        if (offer.getApplicableDays() != null && !offer.getApplicableDays().isBlank()) {
            String day = toDayOfWeekEnum(date.getDayOfWeek()).name();
            boolean applicable = Arrays.stream(offer.getApplicableDays().split(","))
                    .map(String::trim).anyMatch(value -> value.equalsIgnoreCase(day));
            if (!applicable) throw badRequest("Offer is not applicable on the selected day");
        }

        if (offer.getStartTime() != null && startTime.isBefore(offer.getStartTime())) {
            throw badRequest("Offer is not valid at the selected booking time");
        }
        if (offer.getEndTime() != null && startTime.isAfter(offer.getEndTime())) {
            throw badRequest("Offer is not valid at the selected booking time");
        }
        if (offer.getMinBookingMinutes() != null && requestedMinutes < offer.getMinBookingMinutes()) {
            throw badRequest("Booking does not meet the offer minimum duration");
        }
    }

    private BigDecimal calculateDiscount(Offer offer, BigDecimal subtotal) {
        if (offer == null || offer.getOfferType() == OfferType.EXTRA_TIME) {
            return BigDecimal.ZERO.setScale(2);
        }
        if (offer.getMinBookingAmount() != null && subtotal.compareTo(offer.getMinBookingAmount()) < 0) {
            throw badRequest("Booking does not meet the offer minimum amount");
        }
        BigDecimal value = offer.getDiscountValue();
        if (value == null || value.compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO.setScale(2);

        BigDecimal discount;
        if (offer.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(value).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else if (offer.getDiscountType() == DiscountType.FIXED) {
            discount = value;
        } else {
            discount = BigDecimal.ZERO;
        }
        return discount.min(subtotal).setScale(2, RoundingMode.HALF_UP);
    }

    private BookingResponse toResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setBookingId(booking.getBookingId());
        response.setCafeName(booking.getCafe().getName());
        response.setCafeSlug(booking.getCafe().getSlug());
        response.setResourceName(booking.getResource().getResourceName());
        response.setGame(booking.getGame() != null ? booking.getGame().getGameName() : null);
        response.setStartTimestamp(booking.getStartTimestamp());
        response.setEndTimestamp(booking.getEndTimestamp());
        response.setDurationMinutes(Duration.between(booking.getStartTimestamp(), booking.getEndTimestamp()).toMinutes());
        response.setHourlyRate(booking.getResource().getHourlyRate());
        response.setSubtotal(booking.getSubtotal());
        response.setDiscountAmount(booking.getDiscountAmount());
        response.setTaxAmount(booking.getTaxAmount());
        response.setTotalAmount(booking.getTotalAmount());
        response.setStatus(booking.getBookingStatus());
        response.setHoldExpiresAt(booking.getHoldExpiresAt());

        if (booking.getPayment() != null) {
            response.setPaymentMethod(booking.getPayment().getPaymentMethod() != null
                    ? booking.getPayment().getPaymentMethod().name() : null);
            response.setTransactionRef(booking.getPayment().getTransactionReference());
            response.setAmountPaid(booking.getPayment().getAmount());
        }
        return response;
    }

    private BookingSummaryResponse toSummaryResponse(Booking booking) {
        BookingSummaryResponse response = new BookingSummaryResponse();
        response.setBookingId(booking.getBookingId());
        response.setCafeName(booking.getCafe().getName());
        response.setCafeSlug(booking.getCafe().getSlug());
        response.setResourceName(booking.getResource().getResourceName());
        response.setStartTimestamp(booking.getStartTimestamp());
        response.setEndTimestamp(booking.getEndTimestamp());
        response.setDurationMinutes(Duration.between(booking.getStartTimestamp(), booking.getEndTimestamp()).toMinutes());
        response.setStatus(booking.getBookingStatus());
        response.setTotalAmount(booking.getTotalAmount());
        response.setHasReview(booking.getReview() != null);
        return response;
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }
}
