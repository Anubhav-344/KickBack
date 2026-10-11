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
import com.beanforge.kickback.entity.Resource;
import com.beanforge.kickback.entity.User;
import com.beanforge.kickback.enums.BookingStatus;
import com.beanforge.kickback.enums.DayOfWeekEnum;
import com.beanforge.kickback.enums.OfferType;
import com.beanforge.kickback.enums.ResourceStatus;
import com.beanforge.kickback.repository.BookingRepository;
import com.beanforge.kickback.repository.GameRepository;
import com.beanforge.kickback.repository.OfferRepository;
import com.beanforge.kickback.repository.ResourceRepository;
import com.beanforge.kickback.repository.UserRepository;
import com.beanforge.kickback.testsupport.TestData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static com.beanforge.kickback.testsupport.HttpAssert.assertStatus;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for the booking rules: pricing, offers, operating hours, overlaps,
 * cancelling, the hold lifecycle. Repositories are mocked, so these need no database.
 *
 * Dates are always "tomorrow", so the tests don't depend on when they run.
 * The fixture cafe is open 10:00-22:00 every day, with a unit at Rs 200/hour.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class BookingServiceTest {

    @Mock BookingRepository bookingRepository;
    @Mock ResourceRepository resourceRepository;
    @Mock GameRepository gameRepository;
    @Mock OfferRepository offerRepository;
    @Mock UserRepository userRepository;

    BookingService service;

    User user;
    Cafe cafe;
    Resource resource;
    Authentication auth;
    LocalDate day;

    @BeforeEach
    void setUp() {
        service = new BookingService(
                bookingRepository, resourceRepository, gameRepository, offerRepository, userRepository);
        ReflectionTestUtils.setField(service, "holdMinutes", 10L);
        ReflectionTestUtils.setField(service, "taxRate", BigDecimal.ZERO);

        day = LocalDate.now().plusDays(1);

        user = TestData.user(1L);
        auth = TestData.loginAs(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        cafe = TestData.cafeOpenDaily(1L, LocalTime.of(10, 0), LocalTime.of(22, 0));
        resource = TestData.resource(10L, cafe, "200.00");
        when(resourceRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(resource));

        when(bookingRepository.existsOverlappingBooking(
                anyLong(), any(), any(), any(), any(), any())).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    // ---------- helpers ----------

    private LocalDateTime at(int hour, int minute) {
        return day.atTime(hour, minute);
    }

    private CreateBookingRequest request(LocalDateTime start, LocalDateTime end) {
        CreateBookingRequest r = new CreateBookingRequest();
        r.setResourceId(10L);
        r.setDate(start.toLocalDate());
        r.setStartTimestamp(start);
        r.setEndTimestamp(end);
        return r;
    }

    /** Registers the offer with the mocked repository, so promo code "SAVE" / id 5 resolve to it. */
    private Offer stub(Offer o) {
        when(offerRepository.findByCafe_CafeIdAndPromoCodeIgnoreCase(1L, "SAVE")).thenReturn(Optional.of(o));
        when(offerRepository.findById(5L)).thenReturn(Optional.of(o));
        return o;
    }

    private Offer percentOffer(String percent) {
        return stub(TestData.percentOffer(cafe, percent));
    }

    private Offer fixedOffer(String amount) {
        return stub(TestData.fixedOffer(cafe, amount));
    }

    private Offer extraTimeOffer(int bonusMinutes) {
        return stub(TestData.extraTimeOffer(cafe, bonusMinutes));
    }

    private BookingResponse book(CreateBookingRequest r) {
        return service.createBooking(auth, r);
    }

    private Booking existingBooking(BookingStatus status, LocalDateTime start, LocalDateTime end) {
        Booking b = TestData.booking(99L, user, resource, status, start, end);
        when(bookingRepository.findByBookingIdAndUser_UserId(99L, 1L)).thenReturn(Optional.of(b));
        return b;
    }

    // ---------- createBooking: pricing ----------

    @Test
    void createsPendingBookingWithHoldAndPriceFromDuration() {
        BookingResponse r = book(request(at(14, 0), at(15, 30)));

        assertThat(r.getStatus()).isEqualTo(BookingStatus.PENDING);
        assertThat(r.getSubtotal()).isEqualByComparingTo("300.00");   // 1.5h x 200
        assertThat(r.getDiscountAmount()).isEqualByComparingTo("0");
        assertThat(r.getTaxAmount()).isEqualByComparingTo("0");
        assertThat(r.getTotalAmount()).isEqualByComparingTo("300.00");
        assertThat(r.getDurationMinutes()).isEqualTo(90);
        assertThat(r.getHoldExpiresAt()).isAfter(LocalDateTime.now().plusMinutes(9));
        assertThat(r.getHoldExpiresAt()).isBefore(LocalDateTime.now().plusMinutes(11));
    }

    @Test
    void addsTaxOnTheDiscountedAmount() {
        ReflectionTestUtils.setField(service, "taxRate", new BigDecimal("18"));
        percentOffer("50");

        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setPromoCode("SAVE");
        BookingResponse r = book(req);

        assertThat(r.getSubtotal()).isEqualByComparingTo("200.00");
        assertThat(r.getDiscountAmount()).isEqualByComparingTo("100.00");
        assertThat(r.getTaxAmount()).isEqualByComparingTo("18.00");    // 18% of 100
        assertThat(r.getTotalAmount()).isEqualByComparingTo("118.00");
    }

    @Test
    void roundsPartHourPricesToTwoDecimals() {
        resource.setHourlyRate(new BigDecimal("150.00"));
        BookingResponse r = book(request(at(14, 0), at(14, 40)));
        assertThat(r.getSubtotal()).isEqualByComparingTo("100.00");    // 40/60 x 150
    }

    // ---------- createBooking: offers ----------

    @Test
    void percentageOfferReducesTotal() {
        percentOffer("10");
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setPromoCode("SAVE"); // (the case-insensitive match itself lives in the repository query, not testable with a mock)
        BookingResponse r = book(req);

        assertThat(r.getDiscountAmount()).isEqualByComparingTo("20.00");
        assertThat(r.getTotalAmount()).isEqualByComparingTo("180.00");
    }

    @Test
    void fixedDiscountCannotGoBelowZero() {
        fixedOffer("500");
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setOfferId(5L);
        BookingResponse r = book(req);

        assertThat(r.getDiscountAmount()).isEqualByComparingTo("200.00");
        assertThat(r.getTotalAmount()).isEqualByComparingTo("0");
    }

    @Test
    void extraTimeOfferLengthensTheSessionButNotThePrice() {
        extraTimeOffer(30);
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setPromoCode("SAVE");
        BookingResponse r = book(req);

        assertThat(r.getEndTimestamp()).isEqualTo(at(15, 30));
        assertThat(r.getSubtotal()).isEqualByComparingTo("200.00");
        assertThat(r.getTotalAmount()).isEqualByComparingTo("200.00");
    }

    @Test
    void extraTimePastClosingIsRejected() {
        extraTimeOffer(30);
        CreateBookingRequest req = request(at(21, 0), at(22, 0)); // + 30 min = after 22:00 close
        req.setPromoCode("SAVE");
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void extraTimeThatCollidesWithAnotherBookingIsRejected() {
        extraTimeOffer(30);
        // The overlap check must be run against the extended end time.
        when(bookingRepository.existsOverlappingBooking(
                eq(10L), eq(at(14, 0)), eq(at(15, 30)), any(), any(), any())).thenReturn(true);
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setPromoCode("SAVE");
        assertStatus(() -> book(req), HttpStatus.CONFLICT);
    }

    @Test
    void inactiveOfferIsRejected() {
        percentOffer("10").setIsActive(false);
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setPromoCode("SAVE");
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void expiredOfferIsRejected() {
        percentOffer("10").setValidTo(LocalDate.now()); // ends today, booking is tomorrow
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setPromoCode("SAVE");
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void offerOnlyForOtherWeekdaysIsRejected() {
        Offer o = percentOffer("10");
        DayOfWeekEnum today = TestData.dayOf(day);
        DayOfWeekEnum other = TestData.nextDay(today);
        o.setApplicableDays(other.name());
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setPromoCode("SAVE");
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void offerOnTheRightWeekdayIsAccepted() {
        Offer o = percentOffer("10");
        DayOfWeekEnum today = TestData.dayOf(day);
        DayOfWeekEnum other = TestData.nextDay(today);
        o.setApplicableDays(other.name() + ", " + today.name());
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setPromoCode("SAVE");
        assertThat(book(req).getDiscountAmount()).isEqualByComparingTo("20.00");
    }

    @Test
    void offerOutsideItsTimeWindowIsRejected() {
        Offer o = percentOffer("10");
        o.setStartTime(LocalTime.of(10, 0));
        o.setEndTime(LocalTime.of(12, 0));
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setPromoCode("SAVE");
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void offerNeedsItsMinimumDuration() {
        percentOffer("10").setMinBookingMinutes(120);
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setPromoCode("SAVE");
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void offerNeedsItsMinimumAmount() {
        percentOffer("10").setMinBookingAmount(new BigDecimal("500"));
        CreateBookingRequest req = request(at(14, 0), at(15, 0)); // subtotal 200
        req.setPromoCode("SAVE");
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void anotherCafesOfferIsRejected() {
        Offer o = percentOffer("10");
        Cafe other = new Cafe();
        other.setCafeId(2L);
        o.setCafe(other);
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setOfferId(5L);
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void unknownPromoCodeIsRejected() {
        when(offerRepository.findByCafe_CafeIdAndPromoCodeIgnoreCase(1L, "NOPE")).thenReturn(Optional.empty());
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setPromoCode("NOPE");
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void offerIdAndPromoCodeThatDisagreeAreRejected() {
        percentOffer("10");
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setOfferId(5L);
        req.setPromoCode("OTHER");
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    // ---------- createBooking: time rules ----------

    @Test
    void startInThePastIsRejected() {
        LocalDateTime start = LocalDateTime.now().minusHours(2);
        assertStatus(() -> book(request(start, start.plusHours(1))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void startingRightNowIsAllowed() {
        // Needs a moment that is inside opening hours today, so use an all-day cafe.
        org.junit.jupiter.api.Assumptions.assumeTrue(LocalTime.now().isBefore(LocalTime.of(23, 30)));
        cafe.getOperatingDays().forEach(d -> {
            d.setOpeningTime(LocalTime.MIN);
            d.setClosingTime(LocalTime.of(23, 59));
        });
        LocalDateTime thisMinute = LocalDateTime.now().truncatedTo(java.time.temporal.ChronoUnit.MINUTES);

        BookingResponse r = book(request(thisMinute, thisMinute.plusMinutes(15)));
        assertThat(r.getStatus()).isEqualTo(BookingStatus.PENDING);
    }

    @Test
    void startOneMinuteAgoIsRejected() {
        LocalDateTime start = LocalDateTime.now().truncatedTo(java.time.temporal.ChronoUnit.MINUTES).minusMinutes(1);
        assertStatus(() -> book(request(start, start.plusMinutes(15))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void startMustBeBeforeEnd() {
        assertStatus(() -> book(request(at(15, 0), at(14, 0))), HttpStatus.BAD_REQUEST);
        assertStatus(() -> book(request(at(15, 0), at(15, 0))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void dateMustMatchTheTimestamps() {
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setDate(day.plusDays(1));
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void startingBeforeOpeningIsRejected() {
        assertStatus(() -> book(request(at(9, 0), at(10, 30))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void endingAfterClosingIsRejected() {
        assertStatus(() -> book(request(at(21, 0), at(22, 30))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void bookingExactlyOpeningToClosingIsAllowed() {
        BookingResponse r = book(request(at(10, 0), at(22, 0)));
        assertThat(r.getDurationMinutes()).isEqualTo(720);
    }

    @Test
    void closedDayIsRejected() {
        DayOfWeekEnum today = TestData.dayOf(day);
        cafe.getOperatingDays().stream()
                .filter(d -> d.getDaysOfWeek() == today)
                .forEach(d -> d.setIsClosed(true));
        assertStatus(() -> book(request(at(14, 0), at(15, 0))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void dayWithNoOperatingHoursConfiguredIsRejected() {
        DayOfWeekEnum today = TestData.dayOf(day);
        cafe.getOperatingDays().removeIf(d -> d.getDaysOfWeek() == today);
        assertStatus(() -> book(request(at(14, 0), at(15, 0))), HttpStatus.BAD_REQUEST);
    }

    // ---------- createBooking: availability ----------

    @Test
    void overlappingBookingIsAConflictAndNothingIsSaved() {
        when(bookingRepository.existsOverlappingBooking(
                anyLong(), any(), any(), any(), any(), any())).thenReturn(true);
        assertStatus(() -> book(request(at(14, 0), at(15, 0))), HttpStatus.CONFLICT);
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void unitUnderMaintenanceCannotBeBooked() {
        resource.setStatus(ResourceStatus.MAINTENANCE);
        assertStatus(() -> book(request(at(14, 0), at(15, 0))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void unitOutOfServiceCannotBeBooked() {
        resource.setStatus(ResourceStatus.OUT_OF_SERVICE);
        assertStatus(() -> book(request(at(14, 0), at(15, 0))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void unitInUseRightNowCanStillBeBookedForALaterSlot() {
        resource.setStatus(ResourceStatus.BOOKED);
        assertThat(book(request(at(14, 0), at(15, 0))).getStatus()).isEqualTo(BookingStatus.PENDING);
    }

    @Test
    void unknownResourceIsNotFound() {
        when(resourceRepository.findByIdForUpdate(10L)).thenReturn(Optional.empty());
        assertStatus(() -> book(request(at(14, 0), at(15, 0))), HttpStatus.NOT_FOUND);
    }

    // ---------- createBooking: game, user ----------

    @Test
    void gameNotOnThisUnitIsRejected() {
        Game g = new Game();
        g.setGameId(7L);
        when(gameRepository.findById(7L)).thenReturn(Optional.of(g));
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setGameId(7L);
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void gameOnThisUnitIsAccepted() {
        Game g = new Game();
        g.setGameId(7L);
        g.setGameName("FC 26");
        resource.getGames().add(g);
        when(gameRepository.findById(7L)).thenReturn(Optional.of(g));
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setGameId(7L);
        assertThat(book(req).getGame()).isEqualTo("FC 26");
    }

    // ---------- createBooking: extra controllers ----------

    /** Registers a game on the unit. gameMax/unitMax may be null (unknown). */
    private Game gameOnUnit(Integer gameMax, Integer unitMax) {
        Game g = new Game();
        g.setGameId(7L);
        g.setGameName("Party game");
        g.setMaxPlayers(gameMax);
        resource.getGames().add(g);
        resource.setMaxPlayers(unitMax == null ? null : unitMax.shortValue());
        offersControllers();
        when(gameRepository.findById(7L)).thenReturn(Optional.of(g));
        return g;
    }

    /** The unit offers extra controllers (rate 0 = free) unless a test sets a real rate. */
    private void offersControllers() {
        if (resource.getExtraControllerRate() == null) {
            resource.setExtraControllerRate(BigDecimal.ZERO);
        }
    }

    private CreateBookingRequest withGame(int extra) {
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setGameId(7L);
        req.setExtraControllers(extra);
        return req;
    }

    @Test
    void extraControllersDefaultToNone() {
        BookingResponse r = book(request(at(14, 0), at(15, 0)));
        assertThat(r.getExtraControllers()).isZero();
        assertThat(r.isExtraControllersUndecided()).isFalse();
    }

    @Test
    void extraControllersWithinTheGameLimitAreSaved() {
        gameOnUnit(4, 4);
        BookingResponse r = book(withGame(3)); // 4 players = 1 included + 3 extra
        assertThat(r.getExtraControllers()).isEqualTo(3);
    }

    @Test
    void oneMoreThanTheGameAllowsIsRejected() {
        gameOnUnit(4, 4);
        assertStatus(() -> book(withGame(4)), HttpStatus.BAD_REQUEST);
    }

    @Test
    void theUnitCanLimitBelowTheGame() {
        gameOnUnit(8, 2); // the game takes 8 but the booth only seats 2
        assertThat(book(withGame(1)).getExtraControllers()).isEqualTo(1);
        assertStatus(() -> book(withGame(2)), HttpStatus.BAD_REQUEST);
    }

    @Test
    void aSinglePlayerGameCannotHaveExtras() {
        gameOnUnit(1, 4);
        assertStatus(() -> book(withGame(1)), HttpStatus.BAD_REQUEST);
    }

    @Test
    void extrasNeedAGame() {
        offersControllers();
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setExtraControllers(1);
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void aGameWithNoKnownLimitCountsAsSinglePlayer() {
        gameOnUnit(null, null);
        assertStatus(() -> book(withGame(1)), HttpStatus.BAD_REQUEST);
    }

    @Test
    void aUnitWithoutAControllerRateRejectsExtras() {
        gameOnUnit(4, 4);
        resource.setExtraControllerRate(null); // e.g. a pool table
        assertStatus(() -> book(withGame(1)), HttpStatus.BAD_REQUEST);
    }

    @Test
    void aUnitWithoutAControllerRateRejectsNotSure() {
        resource.setExtraControllerRate(null);
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setExtraControllersUndecided(true);
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void aUnitWithoutAControllerRateStillBooksNormally() {
        resource.setExtraControllerRate(null);
        BookingResponse r = book(request(at(14, 0), at(15, 0)));
        assertThat(r.getExtraControllers()).isZero();
        assertThat(r.getTotalAmount()).isEqualByComparingTo("200.00");
    }

    @Test
    void zeroExtrasNeedNoGame() {
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setExtraControllers(0);
        assertThat(book(req).getExtraControllers()).isZero();
    }

    @Test
    void notSureIsStoredWithoutACount() {
        offersControllers();
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setExtraControllersUndecided(true);
        BookingResponse r = book(req);
        assertThat(r.isExtraControllersUndecided()).isTrue();
        assertThat(r.getExtraControllers()).isZero();
    }

    @Test
    void notSureCannotBeCombinedWithACount() {
        gameOnUnit(4, 4);
        CreateBookingRequest req = withGame(2);
        req.setExtraControllersUndecided(true);
        assertStatus(() -> book(req), HttpStatus.BAD_REQUEST);
    }

    // Unit rate in setUp is 200/hr, no tax. Extra controller rate is set per test.

    private void controllerRate(String rate) {
        resource.setExtraControllerRate(new BigDecimal(rate));
    }

    @Test
    void extraControllersAreChargedPerControllerPerHour() {
        gameOnUnit(4, 4);
        controllerRate("30.00");
        BookingResponse r = book(withGame(2)); // 1 hour: 2 x 30 = 60
        assertThat(r.getExtraControllersAmount()).isEqualByComparingTo("60.00");
        assertThat(r.getSubtotal()).isEqualByComparingTo("260.00");
        assertThat(r.getTotalAmount()).isEqualByComparingTo("260.00");
    }

    @Test
    void extraControllerChargeScalesWithTheDuration() {
        gameOnUnit(4, 4);
        controllerRate("30.00");
        CreateBookingRequest req = withGame(2);
        req.setEndTimestamp(at(16, 0)); // 2 hours: 2 x 30 x 2 = 120
        BookingResponse r = book(req);
        assertThat(r.getExtraControllersAmount()).isEqualByComparingTo("120.00");
        assertThat(r.getTotalAmount()).isEqualByComparingTo("520.00"); // 400 + 120
    }

    @Test
    void extraControllerChargeHandlesPartHours() {
        gameOnUnit(4, 4);
        controllerRate("30.00");
        CreateBookingRequest req = withGame(2);
        req.setEndTimestamp(at(14, 45)); // 45 min: 2 x 30 x 0.75 = 45
        assertThat(book(req).getExtraControllersAmount()).isEqualByComparingTo("45.00");
    }

    @Test
    void aFreeControllerRateChargesNothing() {
        gameOnUnit(4, 4);
        controllerRate("0.00");
        BookingResponse r = book(withGame(3));
        assertThat(r.getExtraControllersAmount()).isEqualByComparingTo("0.00");
        assertThat(r.getTotalAmount()).isEqualByComparingTo("200.00");
    }

    @Test
    void notSureIsNotChargedUpFront() {
        gameOnUnit(4, 4);
        controllerRate("30.00");
        CreateBookingRequest req = request(at(14, 0), at(15, 0));
        req.setExtraControllersUndecided(true);
        BookingResponse r = book(req);
        assertThat(r.getTotalAmount()).isEqualByComparingTo("200.00");
        assertThat(r.getExtraControllerRate()).isEqualByComparingTo("30.00"); // so the UI can say what it will cost
    }

    @Test
    void discountAndTaxApplyToExtraControllersToo() {
        ReflectionTestUtils.setField(service, "taxRate", new BigDecimal("10"));
        gameOnUnit(4, 4);
        controllerRate("30.00");
        percentOffer("10");
        CreateBookingRequest req = withGame(2); // subtotal 260
        req.setPromoCode("SAVE");
        BookingResponse r = book(req);
        assertThat(r.getDiscountAmount()).isEqualByComparingTo("26.00");
        assertThat(r.getTaxAmount()).isEqualByComparingTo("23.40"); // 10% of 234
        assertThat(r.getTotalAmount()).isEqualByComparingTo("257.40");
    }

    @Test
    void bonusMinutesFromAnOfferAreNotChargedForControllers() {
        gameOnUnit(4, 4);
        controllerRate("30.00");
        extraTimeOffer(30);
        CreateBookingRequest req = withGame(2);
        req.setPromoCode("SAVE");
        assertThat(book(req).getExtraControllersAmount()).isEqualByComparingTo("60.00"); // 1 paid hour only
    }

    @Test
    void deletedUserCannotBook() {
        user.setDeletedAt(LocalDateTime.now());
        assertStatus(() -> book(request(at(14, 0), at(15, 0))), HttpStatus.UNAUTHORIZED);
    }

    @Test
    void nonNumericTokenSubjectIsUnauthorized() {
        Authentication bad = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("not-a-number", null, List.of());
        assertStatus(() -> service.createBooking(bad, request(at(14, 0), at(15, 0))), HttpStatus.UNAUTHORIZED);
    }

    // ---------- cancelBooking ----------

    @Test
    void cancelsAFuturePendingBooking() {
        Booking b = existingBooking(BookingStatus.PENDING, at(14, 0), at(15, 0));
        CancelBookingResponse r = service.cancelBooking(auth, 99L);
        assertThat(r.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        assertThat(b.getHoldExpiresAt()).isNull();
    }

    @Test
    void cancelsAFutureConfirmedBooking() {
        existingBooking(BookingStatus.CONFIRMED, at(14, 0), at(15, 0));
        assertThat(service.cancelBooking(auth, 99L).getStatus()).isEqualTo(BookingStatus.CANCELLED);
    }

    @Test
    void cannotCancelOnceTheSessionHasStarted() {
        existingBooking(BookingStatus.CONFIRMED,
                LocalDateTime.now().minusMinutes(10), LocalDateTime.now().plusMinutes(50));
        assertStatus(() -> service.cancelBooking(auth, 99L), HttpStatus.BAD_REQUEST);
    }

    @Test
    void cannotCancelCompletedCancelledOrExpiredBookings() {
        for (BookingStatus s : List.of(BookingStatus.COMPLETED, BookingStatus.CANCELLED,
                BookingStatus.EXPIRED, BookingStatus.NO_SHOW)) {
            existingBooking(s, at(14, 0), at(15, 0));
            assertStatus(() -> service.cancelBooking(auth, 99L), HttpStatus.BAD_REQUEST);
        }
    }

    @Test
    void cancellingAPendingBookingWhoseHoldLapsedIsAConflict() {
        Booking b = existingBooking(BookingStatus.PENDING, at(14, 0), at(15, 0));
        b.setHoldExpiresAt(LocalDateTime.now().minusMinutes(1));
        assertStatus(() -> service.cancelBooking(auth, 99L), HttpStatus.CONFLICT);
    }

    @Test
    void cannotCancelSomeoneElsesBooking() {
        when(bookingRepository.findByBookingIdAndUser_UserId(404L, 1L)).thenReturn(Optional.empty());
        assertStatus(() -> service.cancelBooking(auth, 404L), HttpStatus.NOT_FOUND);
    }

    // ---------- updateBookingOffer ----------

    @Test
    void appliesAnOfferToAPendingBookingAndRecalculatesTotal() {
        existingBooking(BookingStatus.PENDING, at(14, 0), at(15, 0));
        percentOffer("25");
        UpdateBookingOfferRequest req = new UpdateBookingOfferRequest();
        req.setPromoCode("SAVE");

        BookingResponse r = service.updateBookingOffer(auth, 99L, req);
        assertThat(r.getDiscountAmount()).isEqualByComparingTo("50.00");
        assertThat(r.getTotalAmount()).isEqualByComparingTo("150.00");
    }

    @Test
    void sendingNoOfferClearsTheDiscount() {
        Booking b = existingBooking(BookingStatus.PENDING, at(14, 0), at(15, 0));
        b.setDiscountAmount(new BigDecimal("50.00"));
        b.setTotalAmount(new BigDecimal("150.00"));

        BookingResponse r = service.updateBookingOffer(auth, 99L, new UpdateBookingOfferRequest());
        assertThat(r.getDiscountAmount()).isEqualByComparingTo("0");
        assertThat(r.getTotalAmount()).isEqualByComparingTo("200.00");
    }

    @Test
    void extraTimeOffersCannotBeAddedAfterCreation() {
        existingBooking(BookingStatus.PENDING, at(14, 0), at(15, 0));
        extraTimeOffer(30);
        UpdateBookingOfferRequest req = new UpdateBookingOfferRequest();
        req.setPromoCode("SAVE");
        assertStatus(() -> service.updateBookingOffer(auth, 99L, req), HttpStatus.BAD_REQUEST);
    }

    @Test
    void offerCannotBeChangedOnAConfirmedBooking() {
        existingBooking(BookingStatus.CONFIRMED, at(14, 0), at(15, 0));
        assertStatus(() -> service.updateBookingOffer(auth, 99L, new UpdateBookingOfferRequest()),
                HttpStatus.BAD_REQUEST);
    }

    @Test
    void offerCannotBeChangedAfterTheHoldLapsed() {
        Booking b = existingBooking(BookingStatus.PENDING, at(14, 0), at(15, 0));
        b.setHoldExpiresAt(LocalDateTime.now().minusSeconds(5));
        assertStatus(() -> service.updateBookingOffer(auth, 99L, new UpdateBookingOfferRequest()),
                HttpStatus.CONFLICT);
    }

    // ---------- my bookings + lifecycle job ----------

    @Test
    void myBookingsHidesExpiredHolds() {
        Booking confirmed = existingBooking(BookingStatus.CONFIRMED, at(14, 0), at(15, 0));
        Booking expired = existingBooking(BookingStatus.EXPIRED, at(16, 0), at(17, 0));
        expired.setBookingId(100L);
        when(bookingRepository.findByUser_UserIdOrderByStartTimestampDesc(1L))
                .thenReturn(List.of(confirmed, expired));

        List<BookingSummaryResponse> list = service.getMyBookings(auth);
        assertThat(list).hasSize(1);
        assertThat(list.get(0).getStatus()).isEqualTo(BookingStatus.CONFIRMED);
    }

    @Test
    void lifecycleJobExpiresLapsedHoldsAndCompletesFinishedSessions() {
        Booking lapsed = existingBooking(BookingStatus.PENDING, at(14, 0), at(15, 0));
        lapsed.setHoldExpiresAt(LocalDateTime.now().minusMinutes(1));
        Booking finished = existingBooking(BookingStatus.CONFIRMED,
                LocalDateTime.now().minusHours(2), LocalDateTime.now().minusHours(1));

        when(bookingRepository.findByBookingStatusAndHoldExpiresAtBefore(eq(BookingStatus.PENDING), any()))
                .thenReturn(List.of(lapsed));
        when(bookingRepository.findByBookingStatusAndEndTimestampBefore(eq(BookingStatus.CONFIRMED), any()))
                .thenReturn(List.of(finished));

        service.processBookingLifecycle();

        assertThat(lapsed.getBookingStatus()).isEqualTo(BookingStatus.EXPIRED);
        assertThat(lapsed.getHoldExpiresAt()).isNull();
        assertThat(finished.getBookingStatus()).isEqualTo(BookingStatus.COMPLETED);
    }
}