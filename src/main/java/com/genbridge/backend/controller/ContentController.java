package com.genbridge.backend.controller;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.entity.Content;
import com.genbridge.backend.services.ContentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for content term management.
 * Provides the public glossary endpoint, per-lesson content retrieval, and admin CRUD operations.
 */
@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    // LEARNER: Get all content terms (glossary)
    @GetMapping("/glossary")
    public ResponseEntity<List<Content>> getAllContent() {
        return ResponseEntity.ok(contentService.getAllContent());
    }

    // LEARNER: Get all content terms for a lesson
    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<Content>> getContentByLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(contentService.getContentByLesson(lessonId));
    }

    // ADMIN: Add a content term to a lesson
    @PostMapping
    public ResponseEntity<Content> createContent(@Valid @RequestBody ContentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contentService.createContent(request));
    }

    // ADMIN: Update a content term
    @PutMapping("/{id}")
    public ResponseEntity<Content> updateContent(@PathVariable Long id,
                                                  @Valid @RequestBody ContentRequest request) {
        return ResponseEntity.ok(contentService.updateContent(id, request));
    }

    // ADMIN: Delete a content term
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        contentService.deleteContent(id);
        return ResponseEntity.noContent().build();
    }
}
