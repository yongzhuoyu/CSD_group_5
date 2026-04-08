package com.genbridge.backend.controller;

import com.genbridge.backend.dto.CreateReportRequest;
import com.genbridge.backend.entity.ContentReport;
import com.genbridge.backend.services.ContentReportService;
import com.genbridge.backend.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PatchMapping;

import java.util.List;

/**
 * REST controller for learner-submitted content error reports.
 * Learners submit reports; admins view all reports and mark them resolved via PATCH.
 */
@RestController
public class ContentReportController {

    private final ContentReportService contentReportService;

    public ContentReportController(ContentReportService contentReportService) {
        this.contentReportService = contentReportService;
    }

    // LEARNER: Submit a report for a lesson
    @PostMapping("/api/lessons/{lessonId}/report")
    public ResponseEntity<ContentReport> createReport(
            @PathVariable Long lessonId,
            @Valid @RequestBody CreateReportRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contentReportService.createReport(lessonId, request, user));
    }

    // ADMIN: Get all reports
    @GetMapping("/api/admin/reports")
    public ResponseEntity<List<ContentReport>> getAllReports() {
        return ResponseEntity.ok(contentReportService.getAllReports());
    }

    // ADMIN: Resolve a report — PATCH to update its status to RESOLVED
    @PatchMapping("/api/admin/reports/{reportId}")
    public ResponseEntity<ContentReport> resolveReport(@PathVariable Long reportId) {
        return ResponseEntity.ok(contentReportService.resolveReport(reportId));
    }
}
