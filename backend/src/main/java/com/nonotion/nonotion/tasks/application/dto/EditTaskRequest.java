package com.nonotion.nonotion.tasks.application.dto;

import com.nonotion.nonotion.tasks.domain.model.Priority;
import com.nonotion.nonotion.tasks.domain.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record EditTaskRequest(
        String title,
        String description,
        Priority priority,
        Instant dueDate,
        TaskStatus taskStatus,
        @NotNull() Instant updatedAt,
        @NotNull() Instant deletedAt
) {}
