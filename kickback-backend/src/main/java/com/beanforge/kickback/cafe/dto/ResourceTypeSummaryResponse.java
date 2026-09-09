package com.beanforge.kickback.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceTypeSummaryResponse {

    private Long resourceTypeId;
    private String resourceName;
    private long totalUnits;
    private BigDecimal startingHourlyRate;
    private boolean supportsGames;

}
