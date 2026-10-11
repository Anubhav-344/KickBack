package com.beanforge.kickback.testsupport;

import com.beanforge.kickback.entity.Booking;
import com.beanforge.kickback.entity.Cafe;
import com.beanforge.kickback.entity.Offer;
import com.beanforge.kickback.entity.OperatingDay;
import com.beanforge.kickback.entity.Payment;
import com.beanforge.kickback.entity.Resource;
import com.beanforge.kickback.entity.User;
import com.beanforge.kickback.enums.BookingStatus;
import com.beanforge.kickback.enums.DayOfWeekEnum;
import com.beanforge.kickback.enums.DiscountType;
import com.beanforge.kickback.enums.OfferType;
import com.beanforge.kickback.enums.PaymentStatus;
import com.beanforge.kickback.enums.ResourceStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Ready-made entities for tests, so each test only states what it cares about.
 * Every method returns a valid, ordinary object; change the one field your test is about:
 *
 *   Offer o = TestData.percentOffer(cafe, "10");
 *   o.setValidTo(LocalDate.now());      // now it is the "expired offer" case
 *
 * Nothing here touches a database or Spring. Add new builders here when a new entity needs them.
 */
public final class TestData {

    private TestData() {}

    // ---------- people ----------

    public static User user(long id) {
        User u = new User();
        u.setUserId(id);
        u.setFirstName("Test");
        u.setLastName("User" + id);
        u.setEmail("user" + id + "@example.com");
        return u;
    }

    /** A logged-in caller, as the controllers pass it to services (the JWT subject is the user id). */
    public static Authentication loginAs(long userId) {
        return new UsernamePasswordAuthenticationToken(String.valueOf(userId), null, List.of());
    }

    // ---------- cafes and units ----------

    /** A cafe open every day of the week between the two times. */
    public static Cafe cafeOpenDaily(long id, LocalTime opens, LocalTime closes) {
        Cafe cafe = new Cafe();
        cafe.setCafeId(id);
        cafe.setName("Respawn Lounge");
        cafe.setSlug("respawn-lounge");

        List<OperatingDay> days = new ArrayList<>();
        for (DayOfWeekEnum d : DayOfWeekEnum.values()) {
            OperatingDay od = new OperatingDay();
            od.setCafe(cafe);
            od.setDaysOfWeek(d);
            od.setOpeningTime(opens);
            od.setClosingTime(closes);
            od.setIsClosed(false);
            days.add(od);
        }
        cafe.setOperatingDays(days);
        return cafe;
    }

    /** A bookable unit with no games, status AVAILABLE. {@code hourlyRate} like "200.00". */
    public static Resource resource(long id, Cafe cafe, String hourlyRate) {
        Resource r = new Resource();
        r.setResourceId(id);
        r.setCafe(cafe);
        r.setResourceName("PS5 - Unit " + id);
        r.setHourlyRate(new BigDecimal(hourlyRate));
        r.setStatus(ResourceStatus.AVAILABLE);
        r.setGames(new ArrayList<>());
        return r;
    }

    // ---------- offers ----------

    /** An active offer, id 5, code "SAVE", valid from 30 days ago to 30 days ahead. */
    public static Offer offer(Cafe cafe, OfferType type) {
        Offer o = new Offer();
        o.setOfferId(5L);
        o.setCafe(cafe);
        o.setTitle("Test offer");
        o.setPromoCode("SAVE");
        o.setOfferType(type);
        o.setIsActive(true);
        o.setValidFrom(LocalDate.now().minusDays(30));
        o.setValidTo(LocalDate.now().plusDays(30));
        return o;
    }

    public static Offer percentOffer(Cafe cafe, String percent) {
        Offer o = offer(cafe, OfferType.PERCENTAGE_DISCOUNT);
        o.setDiscountType(DiscountType.PERCENTAGE);
        o.setDiscountValue(new BigDecimal(percent));
        return o;
    }

    public static Offer fixedOffer(Cafe cafe, String amount) {
        Offer o = offer(cafe, OfferType.FLAT_DISCOUNT);
        o.setDiscountType(DiscountType.FIXED);
        o.setDiscountValue(new BigDecimal(amount));
        return o;
    }

    public static Offer extraTimeOffer(Cafe cafe, int bonusMinutes) {
        Offer o = offer(cafe, OfferType.EXTRA_TIME);
        o.setBonusMinutes(bonusMinutes);
        return o;
    }

    // ---------- bookings and payments ----------

    /**
     * A booking worth Rs 200 with no discount or tax. A PENDING one has a hold that ends in 5 minutes.
     * Pass null for user/resource when the test doesn't need them.
     */
    public static Booking booking(long id, User user, Resource resource, BookingStatus status,
                                  LocalDateTime start, LocalDateTime end) {
        Booking b = new Booking();
        b.setBookingId(id);
        b.setUser(user);
        b.setResource(resource);
        b.setCafe(resource == null ? null : resource.getCafe());
        b.setStartTimestamp(start);
        b.setEndTimestamp(end);
        b.setBookingStatus(status);
        b.setSubtotal(new BigDecimal("200.00"));
        b.setDiscountAmount(BigDecimal.ZERO);
        b.setTaxAmount(BigDecimal.ZERO);
        b.setTotalAmount(new BigDecimal("200.00"));
        if (status == BookingStatus.PENDING) {
            b.setHoldExpiresAt(LocalDateTime.now().plusMinutes(5));
        }
        return b;
    }

    /** Shortcut for tests that only care about status and amount (payments). */
    public static Booking booking(long id, BookingStatus status) {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        return booking(id, null, null, status, start, start.plusHours(1));
    }

    public static Payment payment(long id, Booking booking, PaymentStatus status, String reference) {
        Payment p = new Payment();
        p.setPaymentId(id);
        p.setBooking(booking);
        p.setAmount(booking.getTotalAmount());
        p.setPaymentStatus(status);
        p.setTransactionReference(reference);
        return p;
    }

    // ---------- dates ----------

    /** The weekday enum for a date, e.g. a Monday gives MON. */
    public static DayOfWeekEnum dayOf(LocalDate date) {
        return DayOfWeekEnum.values()[date.getDayOfWeek().getValue() - 1];
    }

    /** The weekday after the given one (SUN wraps to MON). */
    public static DayOfWeekEnum nextDay(DayOfWeekEnum day) {
        return DayOfWeekEnum.values()[(day.ordinal() + 1) % 7];
    }
}