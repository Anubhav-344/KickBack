package com.beanforge.kickback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.beanforge.kickback.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByBooking_Cafe_CafeIdOrderByCreatedAtDesc(Long cafeId);

    boolean existsByBooking_BookingId(Long bookingId);
}
