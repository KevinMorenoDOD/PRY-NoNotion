package com.nonotion.nonotion.tasks.domain.model;

import com.nonotion.nonotion.shared.domain.BaseEntity;
import jakarta.persistence.*;

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

    @Column(name="sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(name="deleted_at")
    private Instant deletedAt;

    public TaskList(Long userId, String name, String color) {
        this.userId = userId;
        this.name = name;
        this.color = color;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }
}
