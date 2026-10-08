package com.beanforge.kickback.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest {

    /** Email or phone, same as login. The reset link is sent to the account's email. */
    @NotBlank(message = "Email or phone is required")
    private String identifier;
}
