package com.nonotion.nonotion.auth.infrastructure.persistence;

import com.nonotion.nonotion.auth.application.port.out.PasswordResetTokenRepository;
import com.nonotion.nonotion.auth.domain.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepositoryJpaAdapter extends PasswordResetTokenRepository, JpaRepository<PasswordResetToken, Long> {
}
