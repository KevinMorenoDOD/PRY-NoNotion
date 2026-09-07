package com.nonotion.nonotion.tasks.application.port.out;

import com.nonotion.nonotion.tasks.domain.model.TaskList;

import java.util.List;
import java.util.Optional;

public interface TaskListRepository {
    TaskList save(TaskList taskList);

    List<TaskList> findAllByUserId(Long userId);
    Optional<TaskList> findByIdAndUserId(Long taskListId, Long userId);
    Optional<TaskList> findById(Long id);
    Optional<TaskList> findByName(String name);
    boolean existsByNameAndUserId(String name, Long userId);
    void deleteByIdAndUserId(Long id, Long userId);
}
