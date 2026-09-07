package com.nonotion.nonotion.tasks.application.service;

import com.nonotion.nonotion.shared.security.CurrentUser;
import com.nonotion.nonotion.tasks.application.dto.CreateTaskListRequest;
import com.nonotion.nonotion.tasks.application.dto.RenameTaskListRequest;
import com.nonotion.nonotion.tasks.application.dto.TaskListResponse;
import com.nonotion.nonotion.tasks.application.port.in.TaskListUseCase;
import com.nonotion.nonotion.tasks.application.port.out.TaskListRepository;
import com.nonotion.nonotion.tasks.domain.model.TaskList;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskListService implements TaskListUseCase {

    private final TaskListRepository taskListRepository;
    private final CurrentUser currentUser;

    public TaskListService(TaskListRepository taskListRepository, CurrentUser currentUser) {
        this.taskListRepository = taskListRepository;
        this.currentUser = currentUser;
    }

    @Override
    @Transactional
    public TaskListResponse createTaskList(CreateTaskListRequest request) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        TaskList taskList = new TaskList(userId, request.name(), request.color());
        TaskList saved = taskListRepository.save(taskList);
        return TaskListResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskListResponse> findAllForCurrentUser() {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        return taskListRepository.findAllByUserId(userId)
                .stream()
                .map(TaskListResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public TaskListResponse renameTaskList(Long id, RenameTaskListRequest request) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        TaskList taskList = taskListRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Lista no encontrada"));

        taskList.setName(request.name());

        TaskList saved = taskListRepository.save(taskList);
        return TaskListResponse.from(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        if (!taskListRepository.findByIdAndUserId(id, userId).isPresent()) {
            throw new IllegalArgumentException("Lista no encontrada");
        }
        taskListRepository.deleteByIdAndUserId(id, userId);
    }
}
