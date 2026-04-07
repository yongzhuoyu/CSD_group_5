package com.genbridge.backend.repository;

import com.genbridge.backend.entity.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    List<ForumPost> findAllByOrderByCreatedAtDesc();
}
