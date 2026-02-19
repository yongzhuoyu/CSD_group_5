package com.genbridge.backend.repository;

import com.genbridge.backend.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findByContributorIdAndPublishedFalse(Long contributorId);
}
