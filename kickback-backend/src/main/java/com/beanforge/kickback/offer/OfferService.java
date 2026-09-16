package com.beanforge.kickback.offer;

import com.beanforge.kickback.entity.Offer;
import com.beanforge.kickback.enums.DiscountType;
import com.beanforge.kickback.enums.OfferType;
import com.beanforge.kickback.offer.dto.ValidateOfferRequest;
import com.beanforge.kickback.offer.dto.ValidateOfferResponse;
import com.beanforge.kickback.repository.OfferRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Locale;

@Service
public class OfferService {

    private final OfferRepository offerRepository;

    public OfferService(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    @Transactional(readOnly = true)
    public ValidateOfferResponse validateOffer(ValidateOfferRequest request) {

        if (!request.getEndTimestamp().isAfter(request.getStartTimestamp())) {
            throw badRequest("End time must be after start time");
        }

        if (!request.getDate().equals(request.getStartTimestamp().toLocalDate())
                || !request.getDate().equals(request.getEndTimestamp().toLocalDate())) {
            throw badRequest("Booking date must match the start and end date");
        }

        if (request.getBookingAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw badRequest("Booking amount cannot be negative");
        }

        Offer offer = offerRepository.findById(request.getOfferId())
                .orElseThrow(() -> notFound("Offer not found"));

        validateCafe(offer, request.getCafeId());
        validateCode(offer, request.getPromoCode());
        validateActiveAndDate(offer, request.getDate());
        validateTimeWindow(offer, request.getStartTimestamp().toLocalTime(),
                request.getEndTimestamp().toLocalTime());
        validateApplicableDay(offer, request.getDate().getDayOfWeek());

        long durationMinutes = java.time.Duration.between(
                request.getStartTimestamp(),
                request.getEndTimestamp()
        ).toMinutes();

        if (offer.getMinBookingMinutes() != null
                && durationMinutes < offer.getMinBookingMinutes()) {
            throw badRequest("Minimum booking duration for this offer is "
                    + offer.getMinBookingMinutes() + " minutes");
        }

        if (offer.getMinBookingAmount() != null
                && request.getBookingAmount().compareTo(offer.getMinBookingAmount()) < 0) {
            throw badRequest("Minimum booking amount for this offer is "
                    + offer.getMinBookingAmount());
        }

        BigDecimal discountAmount = calculateDiscount(offer, request.getBookingAmount());
        BigDecimal finalAmount = request.getBookingAmount()
                .subtract(discountAmount)
                .max(BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP);

        return new ValidateOfferResponse(
                true,
                offer.getOfferId(),
                offer.getPromoCode(),
                offer.getTitle(),
                offer.getOfferType().name(),
                offer.getDiscountType() == null ? null : offer.getDiscountType().name(),
                offer.getDiscountValue(),
                offer.getBonusMinutes(),
                discountAmount,
                finalAmount,
                "Offer is valid"
        );
    }

    private BigDecimal calculateDiscount(Offer offer, BigDecimal bookingAmount) {
        if (offer.getOfferType() == OfferType.EXTRA_TIME) {
            return BigDecimal.ZERO.setScale(2);
        }

        if (offer.getDiscountType() == null || offer.getDiscountValue() == null) {
            return BigDecimal.ZERO.setScale(2);
        }

        BigDecimal discount;

        if (offer.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = bookingAmount
                    .multiply(offer.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            discount = offer.getDiscountValue();
        }

        return discount.min(bookingAmount)
                .max(BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private void validateCafe(Offer offer, Long cafeId) {
        if (offer.getCafe() == null || !offer.getCafe().getCafeId().equals(cafeId)) {
            throw badRequest("Offer does not belong to the selected cafe");
        }
    }

    private void validateCode(Offer offer, String promoCode) {
        if (offer.getPromoCode() == null || offer.getPromoCode().isBlank()) {
            return;
        }

        if (promoCode == null || !offer.getPromoCode().equalsIgnoreCase(promoCode.trim())) {
            throw badRequest("Invalid promo code");
        }
    }

    private void validateActiveAndDate(Offer offer, LocalDate date) {
        if (!Boolean.TRUE.equals(offer.getIsActive())) {
            throw badRequest("Offer is inactive");
        }

        if (date.isBefore(offer.getValidFrom()) || date.isAfter(offer.getValidTo())) {
            throw badRequest("Offer is not valid on the selected date");
        }
    }

    private void validateTimeWindow(Offer offer, LocalTime start, LocalTime end) {
        if (offer.getStartTime() == null && offer.getEndTime() == null) {
            return;
        }

        if (offer.getStartTime() == null || offer.getEndTime() == null) {
            throw badRequest("Offer time window is invalid");
        }

        if (start.isBefore(offer.getStartTime())
                || end.isAfter(offer.getEndTime())) {
            throw badRequest("Offer is not valid for the selected booking time");
        }
    }

    private void validateApplicableDay(Offer offer, DayOfWeek dayOfWeek) {
        String applicableDays = offer.getApplicableDays();

        if (applicableDays == null || applicableDays.isBlank()) {
            return;
        }

        String requested = dayOfWeek.name().toUpperCase(Locale.ROOT);

        boolean matches = java.util.Arrays.stream(applicableDays.split(","))
                .map(String::trim)
                .map(value -> value.toUpperCase(Locale.ROOT))
                .anyMatch(value -> value.equals(requested)
                        || value.equals(dayOfWeek.getDisplayName(
                                java.time.format.TextStyle.SHORT,
                                Locale.ENGLISH
                        ).toUpperCase(Locale.ROOT))
                        || value.equals(requested.substring(0, 3)));

        if (!matches) {
            throw badRequest("Offer is not valid on the selected day");
        }
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }
}
