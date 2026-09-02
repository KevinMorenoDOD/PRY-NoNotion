package com.nonotion.nonotion.auth.application.port.out;

import com.nonotion.nonotion.auth.domain.model.EmailVerificationToken;

import java.util.Optional;

public interface EmailVerificationTokenRepository {

    EmailVerificationToken save(EmailVerificationToken token);

    Optional<EmailVerificationToken> findByTokenHash(String tokenHash);

    void delete(EmailVerificationToken token);
}
