package com.beanforge.kickback.support.dto;

import com.beanforge.kickback.enums.TicketCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketRequest {

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotBlank(message = "Subject is required")
    @Size(max = 150, message = "Subject must be at most 150 characters")
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 2000, message = "Message must be 10 to 2000 characters")
    private String message;

    /** Optional: one of the caller's own bookings. */
    private Long bookingId;
}
