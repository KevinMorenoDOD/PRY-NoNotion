package com.nonotion.nonotion.tasks.domain.model;

import com.nonotion.nonotion.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.time.Instant;
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
    private Instant dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private TaskStatus status = TaskStatus.TODO;

     @Column(name="updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

     @Column(name="deted_at")
    private Instant detedAt;


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getListId() {
        return listId;
    }

    public void setListId(Long listId) {
        this.listId = listId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getDetedAt() {
        return detedAt;
    }

    public void setDetedAt(Instant detedAt) {
        this.detedAt = detedAt;
    }
}
