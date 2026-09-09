package com.beanforge.kickback.resource;

import com.beanforge.kickback.resource.dto.AvailabilityResponse;
import com.beanforge.kickback.resource.dto.ResourceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping("/{resourceId}")
    public ResponseEntity<ResourceResponse> getResource(
            @PathVariable Long resourceId) {
        return ResponseEntity.ok(resourceService.getResource(resourceId));
    }

    @GetMapping("/{resourceId}/availability")
    public ResponseEntity<AvailabilityResponse> getAvailability(
            @PathVariable Long resourceId,
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(resourceService.getAvailability(resourceId, date));
    }
}
