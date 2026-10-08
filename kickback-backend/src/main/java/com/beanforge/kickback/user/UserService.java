package com.beanforge.kickback.user;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

import com.beanforge.kickback.entity.User;
import com.beanforge.kickback.enums.BookingStatus;
import com.beanforge.kickback.repository.BookingRepository;
import com.beanforge.kickback.repository.UserRepository;
import com.beanforge.kickback.user.dto.ChangePasswordRequest;
import com.beanforge.kickback.user.dto.DeleteAccountRequest;
import com.beanforge.kickback.user.dto.UpdatePreferencesRequest;
import com.beanforge.kickback.user.dto.UpdateProfileRequest;
import com.beanforge.kickback.user.dto.UserProfileResponse;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       BookingRepository bookingRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser(Authentication authentication) {
        return toResponse(getAuthenticatedUser(authentication));
    }

    @Transactional
    public UserProfileResponse updateProfile(
            Authentication authentication,
            UpdateProfileRequest request) {

        User user = getAuthenticatedUser(authentication);

        if (!request.getEmail().equalsIgnoreCase(user.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        if (!request.getPhone().equals(user.getPhone())
                && userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone number is already registered");
        }

        if (request.getUsername() != null
                && !request.getUsername().isBlank()
                && !request.getUsername().equals(user.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setUsername(request.getUsername());

        // Only touch avatarId when the request actually included one — the
        // main "Save changes" form always sends the current value along with
        // every edit, but this guards against ever accidentally wiping it
        // with a null from some other caller.
        if (request.getAvatarId() != null) {
            user.setAvatarId(request.getAvatarId());
        }

        return toResponse(userRepository.save(user));
    }

    // Settings > Appearance. Saved on the account so the choice follows the
    // user to other devices.
    @Transactional
    public UserProfileResponse updatePreferences(
            Authentication authentication,
            UpdatePreferencesRequest request) {

        User user = getAuthenticatedUser(authentication);
        user.setTheme(request.getTheme());
        return toResponse(userRepository.save(user));
    }

    // Settings > Account security. Wrong current password is a 403 (not 401:
    // the frontend treats 401 as "session expired" and logs the user out).
    @Transactional
    public void changePassword(Authentication authentication, ChangePasswordRequest request) {
        User user = getAuthenticatedUser(authentication);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Current password is incorrect");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "New password must be different from the current one");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // Settings > Delete account.
    //
    // The row is kept but anonymised rather than removed: bookings, payments
    // and reviews reference it (and cafes keep their booking history), so a
    // hard delete would either fail on the foreign keys or erase the cafes'
    // records. Every personal field is scrubbed instead, and the original
    // email, phone and username become free to register again.
    //
    // Refused while the user has a running or upcoming booking, since
    // deleting would silently drop a slot the cafe is holding for them.
    @Transactional
    public void deleteAccount(Authentication authentication, DeleteAccountRequest request) {
        User user = getAuthenticatedUser(authentication);

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Password is incorrect");
        }

        if (bookingRepository.hasActiveBookings(
                user.getUserId(), BookingStatus.PENDING, BookingStatus.CONFIRMED, LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Cancel your upcoming bookings before deleting your account");
        }

        Long id = user.getUserId();
        user.setFirstName("Deleted");
        user.setLastName("user");
        user.setEmail("deleted-" + id + "@deleted.invalid");
        user.setPhone("D" + id); // column is 15 chars and unique
        user.setUsername(null);
        user.setAvatarId(null);
        user.setTheme(null);
        // A random hash nobody knows, so the account can never be logged into.
        user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User is not authenticated");
        }

        try {
            Long userId = Long.valueOf(authentication.getName());

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            if (user.isDeleted()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account no longer exists");
            }
            return user;
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Invalid authenticated user");
        }
    }

    private UserProfileResponse toResponse(User user) {
        return new UserProfileResponse(
                user.getUserId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getUsername(),
                user.getRole().name(),
                user.getAvatarId(),
                user.getTheme() == null ? null : user.getTheme().name()
        );
    }
}
