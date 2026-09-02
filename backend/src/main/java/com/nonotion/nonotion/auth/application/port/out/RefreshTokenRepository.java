package com.nonotion.nonotion.auth.application.port.out;

import com.nonotion.nonotion.auth.domain.model.RefreshToken;

import java.util.Optional;

public interface RefreshTokenRepository {

    RefreshToken save(RefreshToken token);

    Optional<RefreshToken> findByUserId(Long userId);

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    void delete(RefreshToken token);
}
