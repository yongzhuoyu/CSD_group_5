package com.genbridge.backend.content;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/approved")
    public ResponseEntity<List<Content>> getApprovedContent() {
        List<Content> approved = contentService.getApprovedContent();
        return ResponseEntity.ok(approved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Content> getContentById(@PathVariable UUID id) {
        Content content = contentService.getContentById(id);

        // If content doesn't exist or is not approved, return 404
        if (content == null || !content.isApproved()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(content);
    }

}
