package com.beanforge.kickback.resource.dto;

import com.beanforge.kickback.cafe.dto.OperatingWindowResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponse {

    private Long resourceId;
    private LocalDate date;
    private OperatingWindowResponse operatingWindow;
    private List<ExistingBookingResponse> bookings;

}
