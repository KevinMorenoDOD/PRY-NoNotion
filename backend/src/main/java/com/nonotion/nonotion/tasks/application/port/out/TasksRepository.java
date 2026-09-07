package com.nonotion.nonotion.tasks.application.port.out;

import org.springframework.scheduling.config.Task;

import java.util.Optional;

public interface TasksRepository {
    Task save(Task task);

    Optional<Task> findByName(String name);
    Optional<Task> findById(long id);
}
