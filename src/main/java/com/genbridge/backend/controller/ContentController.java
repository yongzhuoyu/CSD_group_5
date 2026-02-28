package com.genbridge.backend.controller;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.dto.ContentResponse;
import com.genbridge.backend.dto.ModerationResponse;
import com.genbridge.backend.dto.RejectRequest;
import com.genbridge.backend.entity.Content;
import com.genbridge.backend.services.ContentService;
import com.genbridge.backend.user.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    @Autowired
    private ContentService contentService;

    // ================= USER =================

    @PostMapping("/draft")
    public ResponseEntity<Content> saveDraft(
            @Valid @RequestBody ContentRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(contentService.saveDraft(request, user.getEmail()));
    }

    @PostMapping("/submit")
    public ResponseEntity<Content> submit(
            @Valid @RequestBody ContentRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(contentService.submitForReview(request, user.getEmail()));
    }

    @GetMapping("/approved")
    public ResponseEntity<List<ContentResponse>> approved() {
        return ResponseEntity.ok(contentService.getApprovedContent());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ContentResponse>> pending() {
        return ResponseEntity.ok(contentService.getPendingContent());
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<List<ContentResponse>> mySubmissions(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                contentService.getMySubmissions(user.getEmail()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContentResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody ContentRequest request,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                contentService.updateContent(id, request, user.getEmail()));
    }

    // ================= MODERATION =================

    @PutMapping("/{id}/approve")
    public ResponseEntity<ModerationResponse> approve(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                contentService.approveContent(id, user));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ModerationResponse> reject(
            @PathVariable UUID id,
            @Valid @RequestBody RejectRequest request,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                contentService.rejectContent(id, request, user));
    }

    // ================= ADMIN DASHBOARD =================

    @GetMapping("/admin/stats")
    public ResponseEntity<ContentService.AdminStats> stats(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(contentService.getAdminStats(user));
    }

    @GetMapping("/admin/approved")
    public ResponseEntity<List<ContentResponse>> approvedByAdmin(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                contentService.getApprovedByAdmin(user));
    }

    @GetMapping("/admin/rejected")
    public ResponseEntity<List<ContentResponse>> rejectedByAdmin(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                contentService.getRejectedByAdmin(user));
    }
}