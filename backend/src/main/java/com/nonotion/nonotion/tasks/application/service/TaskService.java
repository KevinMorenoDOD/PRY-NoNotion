package com.nonotion.nonotion.tasks.application.service;

import com.nonotion.nonotion.shared.security.CurrentUser;
import com.nonotion.nonotion.tasks.application.dto.CreateTaskListRequest;
import com.nonotion.nonotion.tasks.application.dto.RenameTaskListRequest;
import com.nonotion.nonotion.tasks.application.dto.TaskListResponse;
import com.nonotion.nonotion.tasks.application.port.in.TaskUseCase;
import com.nonotion.nonotion.tasks.application.port.out.TaskListRepository;
import com.nonotion.nonotion.tasks.application.port.out.TasksRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService implements TaskUseCase {

    private final TasksRepository tasksRepository;
    private final TaskListRepository taskListRepository;
    private final CurrentUser currentUser;


    public TaskService(TasksRepository tasksRepository, TaskListRepository taskListRepository, CurrentUser currentUser) {
        this.tasksRepository = tasksRepository;
        this.taskListRepository = taskListRepository;
        this.currentUser = currentUser;
    }

    @Override
    @Transactional
    public TaskListResponse createTask(CreateTaskListRequest createTaskListRequest) {
        return null;
    }

    @Override
    public RenameTaskListRequest renameTask(RenameTaskListRequest renameTaskListRequest) {
        return null;
    }
}
