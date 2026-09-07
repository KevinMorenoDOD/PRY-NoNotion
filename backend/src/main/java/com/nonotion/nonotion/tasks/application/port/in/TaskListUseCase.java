package com.nonotion.nonotion.tasks.application.port.in;

import com.nonotion.nonotion.tasks.application.dto.CreateTaskListRequest;
import com.nonotion.nonotion.tasks.application.dto.RenameTaskListRequest;
import com.nonotion.nonotion.tasks.application.dto.TaskListResponse;

import java.util.List;

public interface TaskListUseCase {

    TaskListResponse createTaskList(CreateTaskListRequest request);

    List<TaskListResponse> findAllForCurrentUser();

    TaskListResponse renameTaskList(Long id, RenameTaskListRequest request);

    void delete(Long id);
}
