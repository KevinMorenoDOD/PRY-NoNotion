package com.nonotion.nonotion.tasks.application.service;

import com.nonotion.nonotion.shared.security.CurrentUser;
import com.nonotion.nonotion.tasks.application.dto.CreateTaskRequest;
import com.nonotion.nonotion.tasks.application.dto.DeleteTaskRequest;
import com.nonotion.nonotion.tasks.application.dto.EditTaskRequest;
import com.nonotion.nonotion.tasks.application.dto.TaskResponse;
import com.nonotion.nonotion.tasks.application.port.in.TasksUseCase;
import com.nonotion.nonotion.tasks.application.port.out.TasksRepository;
import com.nonotion.nonotion.tasks.domain.model.Tasks;
import com.nonotion.nonotion.tasks.domain.model.TaskStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class TasksService implements TasksUseCase {

    private final TasksRepository tasksRepository;
    private final CurrentUser currentUser;

    public TasksService(TasksRepository tasksRepository, CurrentUser currentUser) {
        this.tasksRepository = tasksRepository;
        this.currentUser = currentUser;
    }

    @Override
    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        Tasks task = new Tasks();
        task.setUserId(userId);
        task.setListId(request.listId());
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setStatus(TaskStatus.TODO);
        task.setUpdatedAt(Instant.now());

        Tasks saved = tasksRepository.save(task);
        return TaskResponse.from(saved);
    }

    @Override
    public List<TaskResponse> getTasks() {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        List<Tasks> tasks = tasksRepository.findAllByUserId(userId);

        return tasks.stream()
                .map(TaskResponse::from)
                .toList();
    }

    @Override
    public TaskResponse getTask(Long id) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        Tasks tasks = tasksRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        return TaskResponse.from(tasks);
    }

    @Override
    public TaskResponse deleteTask(Long id) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        Tasks taskToDelete = tasksRepository.findByIdAndUserId(id, userId).orElseThrow(() -> new IllegalArgumentException("Task not found"));

        taskToDelete.setStatus(TaskStatus.DONE);
        taskToDelete.setDeletedAt(Instant.now());

        Tasks deleted = tasksRepository.save(taskToDelete);
        return TaskResponse.from(deleted);
    }

    @Override
    @Transactional
    public TaskResponse editTask(EditTaskRequest request) {
        Long userId = currentUser.getUserId()
                .orElseThrow(() -> new IllegalStateException("Usuario no autenticado"));

        Tasks taskToUpdate = tasksRepository.findByIdAndUserId(request.id(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (StringUtils.hasText(request.title())) {
            taskToUpdate.setTitle(request.title());
        }
        if (StringUtils.hasText(request.description())) {
            taskToUpdate.setDescription(request.description());
        }
        if (request.priority() != null) {
            taskToUpdate.setPriority(request.priority());
        }
        if (request.dueDate() != null) {
            taskToUpdate.setDueDate(request.dueDate());
        }
        if (request.taskStatus() != null) {
            taskToUpdate.setStatus(request.taskStatus());
        }
        taskToUpdate.setUpdatedAt(Instant.now());

        Tasks saved = tasksRepository.save(taskToUpdate);
        return TaskResponse.from(saved);
    }
}
