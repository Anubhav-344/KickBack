package com.beanforge.kickback.cafe;

import com.beanforge.kickback.cafe.dto.CafeDetailsResponse;
import com.beanforge.kickback.cafe.dto.CafeListingResponse;
import com.beanforge.kickback.resource.dto.ResourceListResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cafes")
public class CafeController {

    private final CafeService cafeService;

    public CafeController(CafeService cafeService) {
        this.cafeService = cafeService;
    }

    @GetMapping
    public ResponseEntity<List<CafeListingResponse>> getCafes(
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(cafeService.getCafes(city));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CafeDetailsResponse> getCafeBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(cafeService.getCafeBySlug(slug));
    }

    @GetMapping("/{slug}/resources")
    public ResponseEntity<ResourceListResponse> getCafeResources(
            @PathVariable String slug,
            @RequestParam(required = false) Long resourceTypeId) {

        return ResponseEntity.ok(
                cafeService.getResources(slug, resourceTypeId)
        );
    }
}
