package com.beanforge.kickback.user;

import com.beanforge.kickback.booking.BookingService;
import com.beanforge.kickback.booking.dto.BookingSummaryResponse;
import com.beanforge.kickback.user.dto.UpdateProfileRequest;
import com.beanforge.kickback.user.dto.UserProfileResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/me")
public class UserController {

    private final UserService userService;

    private final BookingService bookingService;

    public UserController(UserService userService, BookingService bookingService) {
        this.userService = userService;
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(userService.getCurrentUser(authentication));
    }

    @PatchMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(authentication, request));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingSummaryResponse>> getMyBookings(
            Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyBookings(authentication));
    }
}
