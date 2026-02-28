package com.genbridge.backend.repository;

import com.genbridge.backend.entity.ContentReview;
import com.genbridge.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContentReviewRepository
        extends JpaRepository<ContentReview, UUID> {

    // 🔥 Needed for user rejection reason
    Optional<ContentReview> findTopByContent_IdOrderByReviewedAtDesc(UUID contentId);

    // Already used in your admin pages
    List<ContentReview> findByReviewedByAndDecisionOrderByReviewedAtDesc(
            User reviewedBy,
            String decision);
}