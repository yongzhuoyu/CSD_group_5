package com.genbridge.backend.controller;

import com.genbridge.backend.entity.UserWarning;
import com.genbridge.backend.repository.UserWarningRepository;
import com.genbridge.backend.user.User;
import com.genbridge.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
public class UserModerationController {

    private final UserRepository userRepository;
    private final UserWarningRepository warningRepository;

    public UserModerationController(UserRepository userRepository, UserWarningRepository warningRepository) {
        this.userRepository = userRepository;
        this.warningRepository = warningRepository;
    }

    // GET /api/admin/users — list all non-admin users
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> result = userRepository.findAll().stream()
                .filter(u -> !"ADMIN".equals(u.getRole()))
                .map(u -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", u.getId());
                    map.put("name", u.getName());
                    map.put("email", u.getEmail());
                    map.put("role", u.getRole());
                    map.put("isSuspended", u.isSuspended());
                    map.put("suspensionReason", u.getSuspensionReason());
                    map.put("warningCount", warningRepository.countByUserId(u.getId()));
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // GET /api/admin/users/{id}/warnings — get warning history
    @GetMapping("/{id}/warnings")
    public ResponseEntity<List<Map<String, Object>>> getWarnings(@PathVariable UUID id) {
        List<Map<String, Object>> warnings = warningRepository.findByUserIdOrderByCreatedAtDesc(id).stream()
                .map(w -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", w.getId());
                    map.put("reason", w.getReason());
                    map.put("createdAt", w.getCreatedAt());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(warnings);
    }

    // POST /api/admin/users/{id}/warn
    @PostMapping("/{id}/warn")
    public ResponseEntity<Map<String, Object>> warnUser(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        User admin = (User) authentication.getPrincipal();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        String reason = body.get("reason");
        if (reason == null || reason.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reason is required");
        }
        UserWarning warning = new UserWarning();
        warning.setUserId(user.getId());
        warning.setReason(reason);
        warning.setWarnedBy(admin.getId());
        warningRepository.save(warning);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Warning issued to " + (user.getName() != null ? user.getName() : user.getEmail()));
        response.put("totalWarnings", warningRepository.countByUserId(id));
        return ResponseEntity.ok(response);
    }

    // POST /api/admin/users/{id}/suspend
    @PostMapping("/{id}/suspend")
    public ResponseEntity<Map<String, Object>> suspendUser(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        String reason = body.get("reason");
        if (reason == null || reason.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reason is required");
        }
        user.setSuspended(true);
        user.setSuspensionReason(reason);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", (user.getName() != null ? user.getName() : user.getEmail()) + " has been suspended");
        return ResponseEntity.ok(response);
    }

    // POST /api/admin/users/{id}/unsuspend
    @PostMapping("/{id}/unsuspend")
    public ResponseEntity<Map<String, Object>> unsuspendUser(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setSuspended(false);
        user.setSuspensionReason(null);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", (user.getName() != null ? user.getName() : user.getEmail()) + " has been unsuspended");
        return ResponseEntity.ok(response);
    }

}
