package com.nonotion.nonotion.notes.aplication.dto;

import com.nonotion.nonotion.notes.domain.model.NoteNode;
import com.nonotion.nonotion.notes.domain.model.NoteNodeType;

import java.time.Instant;

public record NoteNodeResponse(
        Long id,
        Long parentId,
        NoteNodeType type,
        String title,
        String content,
        Instant createdAt,
        Instant updatedAt
){
    public static NoteNodeResponse from (NoteNode noteNode){
        return new NoteNodeResponse(
                noteNode.getId(),
                noteNode.getParentId(),
                noteNode.getNodeType(),
                noteNode.getTitle(),
                noteNode.getContent(),
                noteNode.getCreatedAt(),
                noteNode.getUpdatedAt()
        );
    }
}
