package com.nonotion.nonotion.tasks.domain.model;

import com.nonotion.nonotion.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.security.Timestamp;
import java.time.Instant;

@Entity
@Table(name="task_list")
public class TaskList extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name="name", nullable = false , length = 255)
    private String name;

    @Column(name="color")
    private String color;

    @Column(name="short_order", nullable = false)
    private int shortOrder = 0;

    @Column(name="deleted_at")
    private Instant deletedAt;

}
