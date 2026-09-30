package com.nonotion.nonotion.notes.aplication.dto;

import com.nonotion.nonotion.notes.domain.model.NoteNodeType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateNoteNodeRequest(
        Long parentId,
        @NotNull NoteNodeType type,
        @NotNull @Size(min = 1, max = 255) String title,
        String content
) {}