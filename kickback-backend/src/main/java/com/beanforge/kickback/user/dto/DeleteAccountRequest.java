package com.beanforge.kickback.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeleteAccountRequest {

    // Re-entering the password proves it is really the owner, not someone
    // using a phone that was left logged in.
    @NotBlank(message = "Password is required")
    private String password;
}
