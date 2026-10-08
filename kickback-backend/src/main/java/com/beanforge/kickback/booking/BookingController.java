package com.beanforge.kickback.booking;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.beanforge.kickback.booking.dto.BookingResponse;
import com.beanforge.kickback.booking.dto.BookingSummaryResponse;
import com.beanforge.kickback.booking.dto.CancelBookingResponse;
import com.beanforge.kickback.booking.dto.CreateBookingRequest;
import com.beanforge.kickback.booking.dto.UpdateBookingOfferRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            Authentication authentication,
            @Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(authentication, request));
    }

    @GetMapping
    public ResponseEntity<List<BookingSummaryResponse>> getMyBookings(
            Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyBookings(authentication));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBooking(
            Authentication authentication,
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBooking(authentication, bookingId));
    }

    @PatchMapping("/{bookingId}/offer")
    public ResponseEntity<BookingResponse> updateBookingOffer(
            Authentication authentication,
            @PathVariable Long bookingId,
            @RequestBody UpdateBookingOfferRequest request) {
        return ResponseEntity.ok(bookingService.updateBookingOffer(authentication, bookingId, request));
    }

    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<CancelBookingResponse> cancelBooking(
            Authentication authentication,
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.cancelBooking(authentication, bookingId));
    }
}