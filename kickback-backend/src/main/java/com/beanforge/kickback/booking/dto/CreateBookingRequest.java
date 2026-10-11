package com.beanforge.kickback.booking.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {

    @NotNull
    @Positive
    private Long resourceId;

    private Long gameId;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalDateTime startTimestamp;

    @NotNull
    @Future
    private LocalDateTime endTimestamp;

    private Long offerId;

    private String promoCode;

    private String notes;

    /**
     * Controllers the customer wants on top of the one included with every booking.
     * Null means none. Must be 0 .. (max players of the chosen game - 1); a game is
     * required when it is above zero.
     */
    @Min(0)
    @Max(10)
    private Integer extraControllers;

    /** True when the customer will decide at the cafe. Cannot be combined with extraControllers > 0. */
    private Boolean extraControllersUndecided;

}
