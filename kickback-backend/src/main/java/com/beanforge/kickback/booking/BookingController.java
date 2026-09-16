package com.beanforge.kickback.booking;

import com.beanforge.kickback.booking.dto.BookingResponse;
import com.beanforge.kickback.booking.dto.CancelBookingResponse;
import com.beanforge.kickback.booking.dto.CreateBookingRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBooking(
            Authentication authentication,
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBooking(authentication, bookingId));
    }

    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<CancelBookingResponse> cancelBooking(
            Authentication authentication,
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.cancelBooking(authentication, bookingId));
    }
}
