package com.nonotion.nonotion.tasks.application.service;

import com.nonotion.nonotion.shared.security.CurrentUser;
import com.nonotion.nonotion.tasks.application.dto.CreateTaskListsRequest;
import com.nonotion.nonotion.tasks.application.dto.RenameTaskListsRequest;
import com.nonotion.nonotion.tasks.application.dto.TaskListsResponse;
import com.nonotion.nonotion.tasks.application.port.in.TaskListsUseCase;
import com.nonotion.nonotion.tasks.application.port.out.TaskListsRepository;
import com.nonotion.nonotion.tasks.domain.model.TaskLists;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskListsService implements TaskListsUseCase {

    private final TaskListsRepository taskListsRepository;
    private final CurrentUser currentUser;

    public TaskListsService(TaskListsRepository taskListsRepository, CurrentUser currentUser) {
        this.taskListsRepository = taskListsRepository;
        this.currentUser = currentUser;
    }

    @Override
    @Transactional
    public TaskListsResponse createTaskList(CreateTaskListsRequest request) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        TaskLists taskLists = new TaskLists(userId, request.name(), request.color());
        TaskLists saved = taskListsRepository.save(taskLists);
        return TaskListsResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskListsResponse> findAllForCurrentUser() {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        return taskListsRepository.findAllByUserId(userId)
                .stream()
                .map(TaskListsResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public TaskListsResponse renameTaskList(Long id, RenameTaskListsRequest request) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        TaskLists taskLists = taskListsRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Lista no encontrada"));

        taskLists.setName(request.name());

        TaskLists saved = taskListsRepository.save(taskLists);
        return TaskListsResponse.from(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        if (!taskListsRepository.findByIdAndUserId(id, userId).isPresent()) {
            throw new IllegalArgumentException("Lista no encontrada");
        }
        taskListsRepository.deleteByIdAndUserId(id, userId);
    }
}
