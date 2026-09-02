package com.nonotion.nonotion.auth.application.port.out;

import com.nonotion.nonotion.auth.domain.model.User;

import java.util.Optional;

public interface UserRepository {

    User save(User user);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
