package com.beanforge.kickback.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AmenityResponse {

    private Long amenityId;
    private String amenityName;
    private String iconName;
}
