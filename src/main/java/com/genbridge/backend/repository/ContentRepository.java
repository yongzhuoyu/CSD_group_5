package com.genbridge.backend.repository;

import com.genbridge.backend.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ContentRepository extends JpaRepository<Content, UUID> {

    List<Content> findByStatus(String status);

    List<Content> findByCreatedBy_Id(UUID userId);

    long countByStatus(String status);
}