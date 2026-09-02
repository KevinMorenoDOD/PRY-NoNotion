package com.nonotion.nonotion.auth.application.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        UserResponse user
) {
    public AuthResponse {
        tokenType = "Bearer";
    }
}
