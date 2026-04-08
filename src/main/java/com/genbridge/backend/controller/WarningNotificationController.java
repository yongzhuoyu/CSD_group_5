package com.genbridge.backend.controller;

import com.genbridge.backend.entity.UserWarning;
import com.genbridge.backend.repository.UserWarningRepository;
import com.genbridge.backend.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PatchMapping;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST controller for in-app warning notifications.
 * Learners fetch unread warnings and PATCH to mark them all as read.
 */
@RestController
@RequestMapping("/api/me/warnings")
public class WarningNotificationController {

    private final UserWarningRepository warningRepository;

    public WarningNotificationController(UserWarningRepository warningRepository) {
        this.warningRepository = warningRepository;
    }

    // GET /api/me/warnings/unread
    @GetMapping("/unread")
    public ResponseEntity<List<Map<String, Object>>> getUnreadWarnings(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Map<String, Object>> warnings = warningRepository.findByUserIdAndIsReadFalse(user.getId()).stream()
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

    // PATCH /api/me/warnings — mark all warnings as read
    @Transactional
    @PatchMapping
    public ResponseEntity<Void> markWarningsRead(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<UserWarning> unread = warningRepository.findByUserIdAndIsReadFalse(user.getId());
        unread.forEach(w -> w.setRead(true));
        warningRepository.saveAll(unread);
        return ResponseEntity.ok().build();
    }
}
