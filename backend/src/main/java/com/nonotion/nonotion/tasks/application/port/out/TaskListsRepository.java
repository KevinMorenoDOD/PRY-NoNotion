package com.nonotion.nonotion.tasks.application.port.out;

import com.nonotion.nonotion.tasks.domain.model.TaskLists;

import java.util.List;
import java.util.Optional;

public interface TaskListsRepository {
    TaskLists save(TaskLists taskLists);

    List<TaskLists> findAllByUserId(Long userId);
    Optional<TaskLists> findByIdAndUserId(Long taskListId, Long userId);
    boolean existsByNameAndUserId(String name, Long userId);
    void deleteByIdAndUserId(Long id, Long userId);
    Optional<TaskLists> findById(Long id);
    Optional<TaskLists> findByName(String name);
}
