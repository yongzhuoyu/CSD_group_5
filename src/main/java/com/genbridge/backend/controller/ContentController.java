package com.genbridge.backend.controller;

import com.genbridge.backend.config.JwtUtil;
import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.entity.Content;
import com.genbridge.backend.services.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping("/api/content")
@Tag(name = "Content Management", description = "API endpoints for managing educational content")
public class ContentController {

    @Autowired
    private ContentService contentService;

    @Autowired
    private JwtUtil jwtUtil;

    // Helper method to extract role from JWT token
    private String extractRoleFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                return (String) jwtUtil.extractClaims(token).get("role");
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    // USER: Save draft
    @PostMapping("/draft")
    @Operation(summary = "Save content as draft (USER)", description = "Users can save content as draft for future editing")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Draft saved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid content request"),
        @ApiResponse(responseCode = "404", description = "Contributor not found")
    })
    public ResponseEntity<Map<String, String>> saveDraft(
            @Valid @RequestBody ContentRequest request,
            @RequestParam UUID contributorId) {

        contentService.saveDraft(request, contributorId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "✅ Saved to draft successfully");
        return ResponseEntity.ok(response);
    }

    // USER: Submit for review
    @PostMapping("/submit")
    @Operation(summary = "Submit content for admin review (USER)", description = "Users submit their content for admin approval")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Content submitted for review"),
        @ApiResponse(responseCode = "400", description = "Invalid content request"),
        @ApiResponse(responseCode = "404", description = "Contributor not found")
    })
    public ResponseEntity<Map<String, String>> submitForReview(
            @Valid @RequestBody ContentRequest request,
            @RequestParam UUID contributorId) {

        contentService.submitForReview(request, contributorId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "✅ Content submitted for review");
        return ResponseEntity.ok(response);
    }

    // USER: View approved content
    @GetMapping("/approved")
    @Operation(summary = "Get all approved content (USER)", description = "View all content that has been approved by admins")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of approved content"),
        @ApiResponse(responseCode = "404", description = "No approved content found")
    })
    public ResponseEntity<List<Content>> getApprovedContent() {
        List<Content> approved = contentService.getApprovedContent();
        return ResponseEntity.ok(approved);
    }

    // ADMIN: Get pending content waiting for approval
    @GetMapping("/pending")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get pending content (ADMIN ONLY)", description = "Admins can view content awaiting approval")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of pending content"),
        @ApiResponse(responseCode = "403", description = "Unauthorized - Only admins can access this endpoint")
    })
    public ResponseEntity<?> getPendingContent(HttpServletRequest request) {
        String role = extractRoleFromToken(request);
        if (role == null || !role.equals("ADMIN")) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "❌ Unauthorized: Only admins can view pending content");
            return ResponseEntity.status(403).body(error);
        }
        List<Content> pending = contentService.getPendingContent();
        return ResponseEntity.ok(pending);
    }

    // ADMIN: Approve content
    @PutMapping("/{contentId}/approve")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Approve content (ADMIN ONLY)", description = "Admins can approve user-submitted content")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Content approved successfully"),
        @ApiResponse(responseCode = "403", description = "Unauthorized - Only admins can access this endpoint"),
        @ApiResponse(responseCode = "404", description = "Content not found")
    })
    public ResponseEntity<?> approveContent(
            @PathVariable UUID contentId,
            HttpServletRequest request) {
        String role = extractRoleFromToken(request);
        if (role == null || !role.equals("ADMIN")) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "❌ Unauthorized: Only admins can approve content");
            return ResponseEntity.status(403).body(error);
        }

        Content approvedContent = contentService.approveContent(contentId);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "✅ Content approved successfully");
        response.put("content", approvedContent);
        return ResponseEntity.ok(response);
    }

    // ADMIN: Reject content
    @PutMapping("/{contentId}/reject")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Reject content (ADMIN ONLY)", description = "Admins can reject user-submitted content")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Content rejected successfully"),
        @ApiResponse(responseCode = "403", description = "Unauthorized - Only admins can access this endpoint"),
        @ApiResponse(responseCode = "404", description = "Content not found")
    })
    public ResponseEntity<?> rejectContent(
            @PathVariable UUID contentId,
            HttpServletRequest request) {
        String role = extractRoleFromToken(request);
        if (role == null || !role.equals("ADMIN")) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "❌ Unauthorized: Only admins can reject content");
            return ResponseEntity.status(403).body(error);
        }

        Content rejectedContent = contentService.rejectContent(contentId);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "✅ Content rejected");
        response.put("content", rejectedContent);
        return ResponseEntity.ok(response);
    }

    // ADMIN: Delete content
    @DeleteMapping("/{contentId}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Delete content (ADMIN ONLY)", description = "Admins can delete any content from the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Content deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Unauthorized - Only admins can access this endpoint"),
        @ApiResponse(responseCode = "404", description = "Content not found")
    })
    public ResponseEntity<?> deleteContent(
            @PathVariable UUID contentId,
            HttpServletRequest request) {
        String role = extractRoleFromToken(request);
        if (role == null || !role.equals("ADMIN")) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "❌ Unauthorized: Only admins can delete content");
            return ResponseEntity.status(403).body(error);
        }

        contentService.deleteContent(contentId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "✅ Content deleted successfully");
        return ResponseEntity.ok(response);
    }
}
