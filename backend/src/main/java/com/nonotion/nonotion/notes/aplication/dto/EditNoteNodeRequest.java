package com.nonotion.nonotion.notes.aplication.dto;

public record EditNoteNodeRequest(
        Long id,
        Long parentId,
        String title,
        String content
) {}
