package com.beanforge.kickback.booking.dto;

import com.beanforge.kickback.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancelBookingResponse {

    private Long bookingId;
    private BookingStatus status;

}
