package com.beanforge.kickback.resource.dto;

import com.beanforge.kickback.enums.ResourceStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponse {

    private Long resourceId;
    private Long resourceTypeId;
    private String resourceName;
    private String brand;
    private Integer maxPlayers;
    private ResourceStatus status;
    private BigDecimal hourlyRate;
    private String description;
    private List<GameResponse> games;
    private String imageUrl;
    private String nextAvailableAt;

}
