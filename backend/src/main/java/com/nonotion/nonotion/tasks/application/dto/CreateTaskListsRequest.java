package com.nonotion.nonotion.tasks.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTaskListsRequest(
        @NotBlank @Size(max = 50) String name,
        @Size(max = 50) String color
){}
