package com.beanforge.kickback.resource.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceListResponse {

    private ResourceTypeResponse resourceType;
    private List<ResourceResponse> resources;
}
