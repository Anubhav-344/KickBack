package com.beanforge.kickback.offer;

import com.beanforge.kickback.offer.dto.ValidateOfferRequest;
import com.beanforge.kickback.offer.dto.ValidateOfferResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping("/validate")
    public ResponseEntity<ValidateOfferResponse> validateOffer(
            @Valid @RequestBody ValidateOfferRequest request) {

        return ResponseEntity.ok(offerService.validateOffer(request));
    }
}
