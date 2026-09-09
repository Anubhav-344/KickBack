package com.beanforge.kickback.review.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long reviewId;
    private Long bookingId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

}
