package com.beanforge.kickback.review.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long reviewId;
    private Long bookingId;
    private Integer rating;
    private String comment;
    private String reviewerName;
    private LocalDateTime createdAt;

}
