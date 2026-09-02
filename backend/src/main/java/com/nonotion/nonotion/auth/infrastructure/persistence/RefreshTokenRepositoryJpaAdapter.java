package com.nonotion.nonotion.auth.infrastructure.persistence;

import com.nonotion.nonotion.auth.application.port.out.RefreshTokenRepository;
import com.nonotion.nonotion.auth.domain.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepositoryJpaAdapter extends RefreshTokenRepository, JpaRepository<RefreshToken, Long> {
}
