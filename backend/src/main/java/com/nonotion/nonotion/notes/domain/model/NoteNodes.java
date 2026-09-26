package com.nonotion.nonotion.notes.domain.model;

import com.nonotion.nonotion.shared.domain.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Entity
@Table(name= "note_nodes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NoteNodes extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "parent_id")
    private Long parentId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "type")
    private NotesNodeType nodeType = NotesNodeType.NOTE;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public NoteNodes(Long userId, Long parentId, NotesNodeType nodeType, String content) {}


}
