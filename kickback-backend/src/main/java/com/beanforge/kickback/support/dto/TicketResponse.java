package com.beanforge.kickback.support.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TicketResponse {
    private Long ticketId;
    private String category;
    private String subject;
    private String message;
    private String status;
    private Long bookingId;
    private LocalDateTime createdAt;
}
