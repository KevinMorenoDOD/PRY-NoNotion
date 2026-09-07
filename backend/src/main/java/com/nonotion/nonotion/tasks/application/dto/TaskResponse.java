package com.nonotion.nonotion.tasks.application.dto;

import com.nonotion.nonotion.tasks.domain.model.Priority;
import com.nonotion.nonotion.tasks.domain.model.Tasks;
import com.nonotion.nonotion.tasks.domain.model.TaskStatus;

import java.time.Instant;

public record TaskResponse (
        Long id,
        Long taskListId,
        String title,
        String description,
        Priority priority,
        Instant dueDate,
        TaskStatus status
){
    public static TaskResponse from (Tasks task)
    {
        return new TaskResponse(
                task.getId(),
                task.getListId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority(),
                task.getDueDate(),
                task.getStatus()
        );
    }
}
