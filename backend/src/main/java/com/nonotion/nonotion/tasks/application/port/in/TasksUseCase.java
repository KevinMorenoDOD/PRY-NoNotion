package com.nonotion.nonotion.tasks.application.port.in;


import com.nonotion.nonotion.tasks.application.dto.*;

import java.util.List;


public interface TasksUseCase {

    TaskResponse createTask(CreateTaskRequest createTaskRequest);

    List<TaskResponse> getTasks();

    List<TaskResponse> getAllTasksIncludingDeleted();

    TaskResponse getTask(Long id);

    TaskResponse deleteTask(Long id);

    TaskResponse editTask(EditTaskRequest editTaskRequest);

}
