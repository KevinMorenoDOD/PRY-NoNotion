package com.nonotion.nonotion.tasks.application.port.in;

import com.nonotion.nonotion.tasks.application.dto.CreateTaskListsRequest;
import com.nonotion.nonotion.tasks.application.dto.RenameTaskListsRequest;
import com.nonotion.nonotion.tasks.application.dto.TaskListsResponse;

import java.util.List;

public interface TaskListsUseCase {

    TaskListsResponse createTaskList(CreateTaskListsRequest request);

    List<TaskListsResponse> findAllForCurrentUser();

    TaskListsResponse renameTaskList(Long id, RenameTaskListsRequest request);

    void delete(Long id);
}
