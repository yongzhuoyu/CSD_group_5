package com.genbridge.backend.controller;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.entity.Content;
import com.genbridge.backend.services.ContentService;
import com.genbridge.backend.user.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    @Autowired
    private ContentService contentService;

    // LEARNER: Save content as draft
    // contributorId is taken from the JWT token — not from the client
    @PostMapping("/draft")
    public ResponseEntity<Map<String, String>> saveDraft(
            @Valid @RequestBody ContentRequest request,
            @AuthenticationPrincipal User currentUser) {

        contentService.saveDraft(request, currentUser.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Draft saved successfully");
        return ResponseEntity.ok(response);
    }

    // LEARNER: Submit content for admin review
    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> submitForReview(
            @Valid @RequestBody ContentRequest request,
            @AuthenticationPrincipal User currentUser) {

        contentService.submitForReview(request, currentUser.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Content submitted for review");
        return ResponseEntity.ok(response);
    }

    // PUBLIC: View all approved content
    @GetMapping("/approved")
    public ResponseEntity<List<Content>> getApprovedContent() {
        return ResponseEntity.ok(contentService.getApprovedContent());
    }

    // ADMIN: View all content pending review
    @GetMapping("/pending")
    public ResponseEntity<List<Content>> getPendingContent() {
        return ResponseEntity.ok(contentService.getPendingContent());
    }

    // ADMIN: Approve content
    @PutMapping("/{contentId}/approve")
    public ResponseEntity<Content> approveContent(@PathVariable UUID contentId) {
        return ResponseEntity.ok(contentService.approveContent(contentId));
    }

    // ADMIN: Reject content
    @PutMapping("/{contentId}/reject")
    public ResponseEntity<Content> rejectContent(@PathVariable UUID contentId) {
        return ResponseEntity.ok(contentService.rejectContent(contentId));
    }

    // ADMIN: Delete content
    @DeleteMapping("/{contentId}")
    public ResponseEntity<Void> deleteContent(@PathVariable UUID contentId) {
        contentService.deleteContent(contentId);
        return ResponseEntity.noContent().build();
    }
}
