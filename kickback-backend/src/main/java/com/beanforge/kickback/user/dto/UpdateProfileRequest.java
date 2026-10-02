package com.beanforge.kickback.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;

    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "\\d{10}", message = "Phone must contain exactly 10 digits")
    private String phone;

    @Size(max = 30, message = "Username must not exceed 30 characters")
    private String username;

    // Optional — null means "don't change the current avatar". 1-8 matches
    // the frontend's fixed AVATAR_PRESETS gallery; update both sides together
    // if that gallery's size ever changes.
    @Min(value = 1, message = "Invalid avatar selection")
    @Max(value = 8, message = "Invalid avatar selection")
    private Integer avatarId;

}
