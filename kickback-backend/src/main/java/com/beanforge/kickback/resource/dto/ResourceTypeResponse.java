package com.beanforge.kickback.resource.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceTypeResponse {

    private Long resourceTypeId;
    private String resourceName;
    private boolean supportsGames;
    private String resourceImageUrl;

}
