package com.nonotion.nonotion.tasks.domain.model;

import com.nonotion.nonotion.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "task_lists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskLists extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "color")
    private String color;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public TaskLists(Long userId, String name, String color) {
        this.userId = userId;
        this.name = name;
        this.color = color;
    }
}
