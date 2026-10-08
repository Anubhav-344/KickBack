package com.beanforge.kickback.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    // Same rule as signup (SignupRequest).
    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 255, message = "Password must contain at least 6 characters")
    private String newPassword;
}
