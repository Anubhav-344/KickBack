package com.beanforge.kickback.resource.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExistingBookingResponse {

    private int startMinutes;
    private int endMinutes;

}
