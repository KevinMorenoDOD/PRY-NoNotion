package com.nonotion.nonotion.tasks.infrastructure.persistence;

import com.nonotion.nonotion.tasks.application.port.out.TasksRepository;
import com.nonotion.nonotion.tasks.domain.model.Tasks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TasksRepositoryJpaAdapter extends TasksRepository, JpaRepository<Tasks, Long> {
    Tasks save(Tasks task);

    Optional<Tasks> findByIdAndUserId(Long id, Long userId);

    List<Tasks> findAllByUserId(Long userId);
}
