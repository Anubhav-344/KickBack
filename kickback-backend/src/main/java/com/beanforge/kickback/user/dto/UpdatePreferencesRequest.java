package com.beanforge.kickback.user.dto;

import com.beanforge.kickback.enums.Theme;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePreferencesRequest {

    @NotNull(message = "Theme is required")
    private Theme theme;
}
