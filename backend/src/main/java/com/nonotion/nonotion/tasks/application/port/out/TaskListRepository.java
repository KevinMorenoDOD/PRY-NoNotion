package com.nonotion.nonotion.tasks.application.port.out;

import com.nonotion.nonotion.tasks.domain.model.TaskList;

import java.util.Optional;

public interface TaskListRepository {
    TaskList save(TaskList taskList);

    Optional<TaskList> findById(long id);
    Optional<TaskList> findByName(String name);

}
