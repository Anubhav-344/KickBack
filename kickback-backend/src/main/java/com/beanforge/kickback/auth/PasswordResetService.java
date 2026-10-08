package com.beanforge.kickback.auth;

import com.beanforge.kickback.auth.dto.ForgotPasswordRequest;
import com.beanforge.kickback.auth.dto.ResetPasswordRequest;
import com.beanforge.kickback.entity.PasswordResetToken;
import com.beanforge.kickback.entity.User;
import com.beanforge.kickback.repository.PasswordResetTokenRepository;
import com.beanforge.kickback.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class PasswordResetService {

    private static final long TOKEN_TTL_MINUTES = 30;

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetMailer mailer;
    private final String frontendBaseUrl;
    private final SecureRandom random = new SecureRandom();

    public PasswordResetService(UserRepository userRepository,
                                PasswordResetTokenRepository tokenRepository,
                                PasswordEncoder passwordEncoder,
                                PasswordResetMailer mailer,
                                @Value("${app.frontend-base-url:http://localhost:5173}") String frontendBaseUrl) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailer = mailer;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    /**
     * Always returns normally, whether or not the account exists, so the endpoint
     * cannot be used to discover which emails or phones are registered.
     */
    @Transactional
    public void requestReset(ForgotPasswordRequest request) {
        String identifier = request.getIdentifier().trim();

        userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .filter(user -> !user.isDeleted())
                .ifPresent(this::issueToken);
    }

    private void issueToken(User user) {
        LocalDateTime now = LocalDateTime.now();
        tokenRepository.invalidateAllForUser(user.getUserId(), now);

        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        PasswordResetToken entity = new PasswordResetToken();
        entity.setUserId(user.getUserId());
        entity.setTokenHash(hash(token));
        entity.setExpiresAt(now.plusMinutes(TOKEN_TTL_MINUTES));
        tokenRepository.save(entity);

        String url = frontendBaseUrl + "/reset-password?token=" + token;
        mailer.sendResetLink(user.getEmail(), user.getFirstName(), url);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        LocalDateTime now = LocalDateTime.now();

        PasswordResetToken token = tokenRepository.findByTokenHash(hash(request.getToken()))
                .filter(t -> t.getUsedAt() == null && t.getExpiresAt().isAfter(now))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "This reset link is invalid or has expired"));

        User user = userRepository.findById(token.getUserId())
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "This reset link is invalid or has expired"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenRepository.invalidateAllForUser(user.getUserId(), now);
    }

    private static String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
