package com.nonotion.nonotion.tasks.application.dto;

import com.nonotion.nonotion.tasks.domain.model.TaskLists;

public record TaskListsResponse(
        Long id,
        String name,
        String color,
        int sortOrder
){
    public static TaskListsResponse from(TaskLists taskLists)
    {
        return new TaskListsResponse(
                taskLists.getId(),
                taskLists.getName(),
                taskLists.getColor(),
                taskLists.getSortOrder()
        );
    }
}
