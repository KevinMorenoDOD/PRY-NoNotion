package com.nonotion.nonotion.tasks.infrastructure.persistence;

import com.nonotion.nonotion.tasks.application.port.out.TaskListsRepository;
import com.nonotion.nonotion.tasks.domain.model.TaskLists;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskListsRepositoryJpaAdapter extends TaskListsRepository, JpaRepository<TaskLists, Long> {

    List<TaskLists> findAllByUserId(Long userId);

    Optional<TaskLists> findByIdAndUserId(Long id, Long userId);

    Optional<TaskLists> findByName(String name);

    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM TaskLists t WHERE t.name = :name AND t.userId = :userId")
    boolean existsByNameAndUserId(@Param("name") String name, @Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM TaskLists t WHERE t.id = :id AND t.userId = :userId")
    void deleteByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
