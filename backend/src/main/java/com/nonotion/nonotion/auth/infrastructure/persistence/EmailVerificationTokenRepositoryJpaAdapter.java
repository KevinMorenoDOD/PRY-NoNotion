package com.nonotion.nonotion.auth.infrastructure.persistence;

import com.nonotion.nonotion.auth.application.port.out.EmailVerificationTokenRepository;
import com.nonotion.nonotion.auth.domain.model.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailVerificationTokenRepositoryJpaAdapter extends EmailVerificationTokenRepository, JpaRepository<EmailVerificationToken, Long> {
}
