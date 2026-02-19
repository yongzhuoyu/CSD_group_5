package com.genbridge.backend.controller;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.services.ContentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/content")
public class ContentController {
    
    @Autowired
    private ContentService contentService;
    
    @PostMapping("/draft")
    public ResponseEntity<Map<String, String>> saveDraft(
            @Valid @RequestBody ContentRequest request,
            @RequestParam Long contributorId) {
        
        contentService.createContent(request, contributorId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "✅ Saved to draft successfully");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/publish")
    public ResponseEntity<Map<String, String>> publishContent(
            @Valid @RequestBody ContentRequest request,
            @RequestParam Long contributorId) {
        
        contentService.createContent(request, contributorId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "✅ Content is created successfully");
        return ResponseEntity.ok(response);
    }
}
