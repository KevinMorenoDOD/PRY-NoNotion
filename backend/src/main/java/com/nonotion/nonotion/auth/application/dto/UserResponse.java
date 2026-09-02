package com.nonotion.nonotion.auth.application.dto;

import com.nonotion.nonotion.auth.domain.model.User;

public record UserResponse(
        Long id,
        String email,
        String displayName,
        boolean emailVerified
) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getDisplayName(), user.isEmailVerified());
    }
}
