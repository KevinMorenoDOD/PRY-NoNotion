package com.nonotion.nonotion.tasks.application.port.out;

import com.nonotion.nonotion.tasks.domain.model.Tasks;

import java.util.List;
import java.util.Optional;

public interface TasksRepository {
    Tasks save(Tasks task);

    Optional<Tasks> findByIdAndUserId(Long id, Long userId);

    List<Tasks> findAllByUserId(Long userId);
}
