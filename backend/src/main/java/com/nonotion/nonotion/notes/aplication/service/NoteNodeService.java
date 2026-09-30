package com.nonotion.nonotion.notes.aplication.service;

import com.nonotion.nonotion.notes.aplication.dto.CreateNoteNodeRequest;
import com.nonotion.nonotion.notes.aplication.dto.DeleteNoteNodeRequest;
import com.nonotion.nonotion.notes.aplication.dto.EditNoteNodeRequest;
import com.nonotion.nonotion.notes.aplication.dto.NoteNodeResponse;
import com.nonotion.nonotion.notes.aplication.port.in.NoteNodeUseCase;
import com.nonotion.nonotion.notes.aplication.port.out.NoteNodeRepository;
import com.nonotion.nonotion.notes.domain.model.NoteNode;
import com.nonotion.nonotion.notes.domain.model.NoteNodeType;
import com.nonotion.nonotion.shared.security.CurrentUser;
import com.nonotion.nonotion.tasks.application.service.TasksService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class NoteNodeService implements NoteNodeUseCase {

    private final NoteNodeRepository noteNodeRepository;
    private final CurrentUser currentUser;
    private final TasksService tasksService;

    public NoteNodeService(NoteNodeRepository noteNodeRepository, CurrentUser currentUser, TasksService tasksService) {
        this.noteNodeRepository = noteNodeRepository;
        this.currentUser = currentUser;
        this.tasksService = tasksService;
    }

    @Override
    @Transactional
    public NoteNodeResponse createNoteNode(CreateNoteNodeRequest request) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        NoteNode noteNode = new NoteNode();
        noteNode.setUserId(userId);
        noteNode.setParentId(request.parentId());
        noteNode.setNodeType(request.type());
        noteNode.setTitle(request.title());
        noteNode.setContent(request.content());
        noteNode.setUpdatedAt(Instant.now());

        NoteNode saved = noteNodeRepository.save(noteNode);
        return NoteNodeResponse.from(saved);
    }

    @Override
    public List<NoteNodeResponse> findAllForCurrentUser() {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        List<NoteNode> noteNodes = noteNodeRepository.findAllByUserId(userId);

        return noteNodes.stream()
                .filter(node -> node.getDeletedAt() == null)
                .map(NoteNodeResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public NoteNodeResponse editNoteNode(EditNoteNodeRequest request) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        NoteNode nodeToUpdate = noteNodeRepository.findByIdAndUserId(request.id(), userId)
                .filter(node -> node.getDeletedAt() == null)
                .orElseThrow(() -> new IllegalArgumentException("Note node not found"));

        if (request.parentId() != null) {
            if (!request.parentId().equals(nodeToUpdate.getParentId())) {
                validateParent(request.parentId(), userId, nodeToUpdate.getId());
                nodeToUpdate.setParentId(request.parentId());
            }
        }

        if (StringUtils.hasText(request.title())) {
            nodeToUpdate.setTitle(request.title());
        }
        if (request.content() != null) {
            nodeToUpdate.setContent(request.content());
        }

        nodeToUpdate.setUpdatedAt(Instant.now());

        NoteNode saved = noteNodeRepository.save(nodeToUpdate);
        return NoteNodeResponse.from(saved);
    }

    private void validateParent(Long parentId, Long userId, Long currentNodeId) {
        if (parentId.equals(currentNodeId)) {
            throw new IllegalArgumentException("A node cannot be its own parent");
        }

        NoteNode parent = noteNodeRepository.findByIdAndUserId(parentId, userId)
                .filter(node -> node.getDeletedAt() == null)
                .orElseThrow(() -> new IllegalArgumentException("Parent node not found or not owned by user"));

        if (parent.getNodeType() != NoteNodeType.FOLDER) {
            throw new IllegalArgumentException("Parent node must be a folder");
        }

        if (wouldCreateCycle(currentNodeId, parentId, userId)) {
            throw new IllegalArgumentException("Cannot move node into its own descendant (cycle detected)");
        }
    }

    private boolean wouldCreateCycle(Long currentNodeId, Long newParentId, Long userId) {
        Long current = newParentId;
        while (current != null) {
            if (current.equals(currentNodeId)) {
                return true;
            }
            Optional<NoteNode> parent = noteNodeRepository.findByIdAndUserId(current, userId);
            if (parent.isEmpty() || parent.get().getDeletedAt() != null) {
                break;
            }
            current = parent.get().getParentId();
        }
        return false;
    }

    @Override
    public List<NoteNodeResponse> getChildren(Long parentId) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        List<NoteNode> noteNodes = noteNodeRepository.findAllByParentIdAndUserId(parentId, userId);

        return noteNodes.stream()
                .filter(node -> node.getDeletedAt() == null)
                .map(NoteNodeResponse::from)
                .toList();
    }

    @Override
    public Optional<NoteNodeResponse> getNoteNode(Long id) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        return noteNodeRepository.findByIdAndUserId(id, userId)
                .filter(node -> node.getDeletedAt() == null)
                .map(NoteNodeResponse::from);
    }

    @Override
    @Transactional
    public void deleteNoteNode(DeleteNoteNodeRequest request) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        noteNodeRepository.deleteByIdAndUserId(request.id(), userId);
    }
}
