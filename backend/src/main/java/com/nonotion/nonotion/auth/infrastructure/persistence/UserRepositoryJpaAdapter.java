package com.nonotion.nonotion.auth.infrastructure.persistence;

import com.nonotion.nonotion.auth.application.port.out.UserRepository;
import com.nonotion.nonotion.auth.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepositoryJpaAdapter extends UserRepository, JpaRepository<User, Long> {
}
