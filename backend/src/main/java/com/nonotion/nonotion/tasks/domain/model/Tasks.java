package com.nonotion.nonotion.tasks.domain.model;

import com.nonotion.nonotion.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.security.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table
public class Tasks extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name="list_id")
    private Long listId;

    @Column(name="title", nullable = false, length = 255)
    private String title;

    @Column(name="description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name="priority", nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(name="due_date")
    private Timestamp dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private TaskStatus status = TaskStatus.TODO;

     @Column(name="updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

     @Column(name="deted_at")
    private Instant detedAt;


}
