package com.nonotion.nonotion.auth.application.port.out;

import com.nonotion.nonotion.auth.domain.model.PasswordResetToken;

import java.util.Optional;

public interface PasswordResetTokenRepository {

    PasswordResetToken save(PasswordResetToken token);

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    void delete(PasswordResetToken token);
}
