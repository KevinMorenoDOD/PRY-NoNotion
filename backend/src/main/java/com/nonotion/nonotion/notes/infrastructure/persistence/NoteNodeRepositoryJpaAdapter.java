package com.nonotion.nonotion.notes.infrastructure.persistence;

import com.nonotion.nonotion.notes.aplication.port.out.NoteNodeRepository;
import com.nonotion.nonotion.notes.domain.model.NoteNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NoteNodeRepositoryJpaAdapter extends NoteNodeRepository, JpaRepository<NoteNode, Long> {

    NoteNode save(NoteNode noteNode);

    List<NoteNode> findAllByUserId(Long userId);

    Optional<NoteNode> findByIdAndUserId(Long id, Long userId);

    List<NoteNode> findAllByParentIdAndUserId(Long parentId, Long userId);

    @Modifying
    @Query("DELETE FROM NoteNode n WHERE n.id = :id AND n.userId = :userId")
    void deleteByIdAndUserId(@Param("id") Long id, @Param("userId")Long userId);


    Optional<NoteNode> findById(Long id);
    Optional<NoteNode> findByTitle(String name);

}
