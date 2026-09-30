package com.nonotion.nonotion.notes.interfaces;

import com.nonotion.nonotion.notes.aplication.dto.CreateNoteNodeRequest;
import com.nonotion.nonotion.notes.aplication.dto.DeleteNoteNodeRequest;
import com.nonotion.nonotion.notes.aplication.dto.EditNoteNodeRequest;
import com.nonotion.nonotion.notes.aplication.dto.NoteNodeResponse;
import com.nonotion.nonotion.notes.aplication.port.in.NoteNodeUseCase;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/note-nodes")
public class NoteNodeController {

    private final NoteNodeUseCase noteNodeUseCase;

    public NoteNodeController(NoteNodeUseCase noteNodeUseCase) {
        this.noteNodeUseCase = noteNodeUseCase;
    }

    @PostMapping
    public NoteNodeResponse createNoteNode(@Valid @RequestBody CreateNoteNodeRequest request) {
        return noteNodeUseCase.createNoteNode(request);
    }

    @GetMapping
    public List<NoteNodeResponse> getNoteNodes(@RequestParam(required = false) Long parentId) {
        if (parentId != null) {
            return noteNodeUseCase.getChildren(parentId);
        }
        return noteNodeUseCase.findAllForCurrentUser();
    }

    @GetMapping("/{id}")
    public NoteNodeResponse getNoteNode(@PathVariable Long id) {
        return noteNodeUseCase.getNoteNode(id)
                .orElseThrow(() -> new IllegalArgumentException("Note node not found"));
    }

    @PatchMapping("/{id}")
    public NoteNodeResponse editNoteNode(@PathVariable Long id, @Valid @RequestBody EditNoteNodeRequest request) {
        EditNoteNodeRequest updated = new EditNoteNodeRequest(
                id,
                request.parentId(),
                request.title(),
                request.content()
        );
        return noteNodeUseCase.editNoteNode(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteNoteNode(@PathVariable Long id) {
        noteNodeUseCase.deleteNoteNode(new DeleteNoteNodeRequest(id));
    }
}