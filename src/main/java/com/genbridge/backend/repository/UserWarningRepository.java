package com.genbridge.backend.repository;

import com.genbridge.backend.entity.UserWarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserWarningRepository extends JpaRepository<UserWarning, Long> {
    List<UserWarning> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<UserWarning> findByUserIdAndIsReadFalse(UUID userId);
    long countByUserId(UUID userId);
}
