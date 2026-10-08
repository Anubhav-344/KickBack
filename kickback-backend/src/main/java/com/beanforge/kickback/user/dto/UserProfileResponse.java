package com.beanforge.kickback.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String username;
    private String role;
    private Integer avatarId;
    private String theme; // "DARK", "LIGHT", or null if never chosen

}
