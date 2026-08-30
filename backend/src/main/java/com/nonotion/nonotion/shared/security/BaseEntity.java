package com.nonotion.nonotion.shared.security;

import jakarta.persistence.*;

import java.time.Instant;

@MappedSuperclass
public class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false, updatable = false)
    private Instant updatedAt;

}
