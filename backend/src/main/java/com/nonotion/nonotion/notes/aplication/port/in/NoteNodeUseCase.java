package com.nonotion.nonotion.notes.aplication.port.in;

import com.nonotion.nonotion.notes.aplication.dto.CreateNoteNodeRequest;
import com.nonotion.nonotion.notes.aplication.dto.DeleteNoteNodeRequest;
import com.nonotion.nonotion.notes.aplication.dto.EditNoteNodeRequest;
import com.nonotion.nonotion.notes.aplication.dto.NoteNodeResponse;

import java.util.List;
import java.util.Optional;

public interface NoteNodeUseCase {
    NoteNodeResponse createNoteNode (CreateNoteNodeRequest request);

    List<NoteNodeResponse> findAllForCurrentUser();

    NoteNodeResponse editNoteNode (EditNoteNodeRequest request);

    List<NoteNodeResponse> getChildren (Long parentId);

    Optional<NoteNodeResponse> getNoteNode (Long id);

    void deleteNoteNode (DeleteNoteNodeRequest request);
}

