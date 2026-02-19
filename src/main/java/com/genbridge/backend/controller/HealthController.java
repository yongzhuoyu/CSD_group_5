package com.genbridge.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller
 * Use this to verify that your API is running correctly
 */
@RestController
@RequestMapping("/api/health")
@Tag(name = "Health Check", description = "API health and status endpoints")
public class HealthController {

    @GetMapping
    @Operation(summary = "Health check", description = "Verify that the API server is running correctly")
    @ApiResponse(responseCode = "200", description = "API is healthy and running")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "GenBridge API is running successfully");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "genbridge-backend");

        return ResponseEntity.ok(response);
    }
}
