package com.beanforge.kickback.user;

import com.beanforge.kickback.booking.BookingService;
import com.beanforge.kickback.booking.dto.BookingSummaryResponse;
import com.beanforge.kickback.user.dto.ChangePasswordRequest;
import com.beanforge.kickback.user.dto.DeleteAccountRequest;
import com.beanforge.kickback.user.dto.UpdatePreferencesRequest;
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

    // Settings > Appearance
    @PatchMapping("/preferences")
    public ResponseEntity<UserProfileResponse> updatePreferences(
            Authentication authentication,
            @Valid @RequestBody UpdatePreferencesRequest request) {
        return ResponseEntity.ok(userService.updatePreferences(authentication, request));
    }

    // Settings > Account security
    @PostMapping("/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(authentication, request);
        return ResponseEntity.noContent().build();
    }

    // Settings > Delete account (POST rather than DELETE: it carries the
    // password in a body, which many proxies and clients drop from DELETE)
    @PostMapping("/deletion")
    public ResponseEntity<Void> deleteAccount(
            Authentication authentication,
            @Valid @RequestBody DeleteAccountRequest request) {
        userService.deleteAccount(authentication, request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingSummaryResponse>> getMyBookings(
            Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyBookings(authentication));
    }
}
