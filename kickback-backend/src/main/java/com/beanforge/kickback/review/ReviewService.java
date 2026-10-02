package com.beanforge.kickback.review;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.beanforge.kickback.entity.Booking;
import com.beanforge.kickback.entity.Cafe;
import com.beanforge.kickback.entity.Review;
import com.beanforge.kickback.enums.BookingStatus;
import com.beanforge.kickback.repository.BookingRepository;
import com.beanforge.kickback.repository.CafeRepository;
import com.beanforge.kickback.repository.ReviewRepository;
import com.beanforge.kickback.review.dto.CreateReviewRequest;
import com.beanforge.kickback.review.dto.ReviewResponse;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final CafeRepository cafeRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            BookingRepository bookingRepository,
            CafeRepository cafeRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.cafeRepository = cafeRepository;
    }

    @Transactional
    public ReviewResponse createReview(
            Authentication authentication, Long bookingId, CreateReviewRequest request) {

        Long userId = getAuthenticatedUserId(authentication);

        // findByBookingIdAndUser_UserId already guarantees this booking
        // belongs to the caller — a user can only review their own bookings.
        Booking booking = bookingRepository.findByBookingIdAndUser_UserId(bookingId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Booking not found"));

        if (booking.getBookingStatus() != BookingStatus.COMPLETED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Only completed bookings can be reviewed");
        }

        if (reviewRepository.existsByBooking_BookingId(bookingId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "This booking has already been reviewed");
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setRating(request.getRating().byteValue());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);
        recalculateCafeRating(booking.getCafe());

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getCafeReviews(String cafeSlug) {
        Cafe cafe = cafeRepository.findBySlugIgnoreCase(cafeSlug)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cafe not found"));

        return reviewRepository.findByBooking_Cafe_CafeIdOrderByCreatedAtDesc(cafe.getCafeId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Keeps cafes.average_rating / cafes.total_reviews in sync every time a
    // new review comes in, rather than computing it on the fly on every
    // café-listing/detail read.
    private void recalculateCafeRating(Cafe cafe) {
        List<Review> reviews =
                reviewRepository.findByBooking_Cafe_CafeIdOrderByCreatedAtDesc(cafe.getCafeId());

        int count = reviews.size();
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        cafe.setAverageRating(BigDecimal.valueOf(average).setScale(1, RoundingMode.HALF_UP));
        cafe.setTotalReviews(count);
        cafeRepository.save(cafe);
    }

    private ReviewResponse toResponse(Review review) {
        Booking booking = review.getBooking();
        return new ReviewResponse(
                review.getReviewId(),
                booking.getBookingId(),
                review.getRating().intValue(),
                review.getComment(),
                formatReviewerName(booking),
                review.getCreatedAt()
        );
    }

    // "Aarav K." style — first name plus last-initial, for a reasonable
    // amount of privacy on a public-facing review.
    private String formatReviewerName(Booking booking) {
        String firstName = booking.getUser().getFirstName();
        String lastName = booking.getUser().getLastName();
        if (lastName != null && !lastName.isBlank()) {
            return firstName + " " + lastName.charAt(0) + ".";
        }
        return firstName;
    }

    private Long getAuthenticatedUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }
        try {
            return Long.valueOf(authentication.getName());
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authenticated user");
        }
    }
}
