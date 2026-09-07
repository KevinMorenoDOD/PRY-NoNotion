package com.nonotion.nonotion.tasks.application.dto;

import com.nonotion.nonotion.tasks.domain.model.TaskList;

public record TaskListResponse(
        Long id,
        String name,
        String color,
        int sortOrder
){
    public static TaskListResponse from(TaskList taskList)
    {
        return new TaskListResponse(
                taskList.getId(),
                taskList.getName(),
                taskList.getColor(),
                taskList.getSortOrder()
        );
    }
}
