package com.nonotion.nonotion.tasks.application.port.in;

import com.nonotion.nonotion.tasks.application.dto.CreateTaskListRequest;
import com.nonotion.nonotion.tasks.application.dto.RenameTaskListRequest;
import com.nonotion.nonotion.tasks.application.dto.TaskListResponse;
import com.nonotion.nonotion.tasks.domain.model.TaskList;

public interface TaskUseCase {

    TaskListResponse createTask(CreateTaskListRequest createTaskListRequest);

    RenameTaskListRequest renameTask(RenameTaskListRequest renameTaskListRequest);

}
