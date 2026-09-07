package com.nonotion.nonotion.tasks.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RenameTaskListRequest (
        @NotBlank @Size(max = 255) String name
        )
{}
