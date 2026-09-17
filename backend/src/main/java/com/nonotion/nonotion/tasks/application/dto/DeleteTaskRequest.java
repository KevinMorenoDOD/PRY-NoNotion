package com.nonotion.nonotion.tasks.application.dto;

import com.nonotion.nonotion.tasks.domain.model.TaskStatus;

public record DeleteTaskRequest(
        Long id
) {
}
