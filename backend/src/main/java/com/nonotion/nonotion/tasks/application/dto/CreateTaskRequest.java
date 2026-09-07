package com.nonotion.nonotion.tasks.application.dto;

import com.nonotion.nonotion.tasks.domain.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record CreateTaskRequest (
        @NotNull()Long listId,
        @NotBlank @Size(max = 255)String title,
        String description,
        Priority priority,
        Instant dueDate
){}
