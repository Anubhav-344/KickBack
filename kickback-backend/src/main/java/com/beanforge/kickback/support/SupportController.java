package com.beanforge.kickback.support;

import com.beanforge.kickback.support.dto.CreateTicketRequest;
import com.beanforge.kickback.support.dto.TicketResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Requires login (SecurityConfig's anyRequest().authenticated()).
@RestController
@RequestMapping("/api/support/tickets")
public class SupportController {

    private final SupportService supportService;

    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @PostMapping
    public ResponseEntity<TicketResponse> create(
            Authentication authentication,
            @Valid @RequestBody CreateTicketRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(supportService.create(authentication, request));
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> listMine(Authentication authentication) {
        return ResponseEntity.ok(supportService.listMine(authentication));
    }
}