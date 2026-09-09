package com.beanforge.kickback.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperatingWindowResponse {

    private int openingMinutes;
    private int closingMinutes;
    private boolean isClosedToday;

}
