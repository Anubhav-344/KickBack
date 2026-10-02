package com.beanforge.kickback.review;

import com.beanforge.kickback.review.dto.CreateReviewRequest;
import com.beanforge.kickback.review.dto.ReviewResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Requires auth — not in SecurityConfig's permitAll list, so it
    // correctly falls under .anyRequest().authenticated() already.
    @PostMapping("/api/bookings/{bookingId}/reviews")
    public ResponseEntity<ReviewResponse> createReview(
            Authentication authentication,
            @PathVariable Long bookingId,
            @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(authentication, bookingId, request));
    }

    // Public — matches the existing "/api/cafes/**" permitAll pattern, no
    // SecurityConfig change needed since that pattern already covers this path.
    @GetMapping("/api/cafes/{slug}/reviews")
    public ResponseEntity<List<ReviewResponse>> getCafeReviews(@PathVariable String slug) {
        return ResponseEntity.ok(reviewService.getCafeReviews(slug));
    }
}
