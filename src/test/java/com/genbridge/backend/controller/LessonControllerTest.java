package com.genbridge.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.genbridge.backend.config.JwtUtil;
import com.genbridge.backend.config.SecurityConfig;
import com.genbridge.backend.entity.Lesson;
import com.genbridge.backend.services.LessonService;
import com.genbridge.backend.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for LessonController — verifies HTTP routing, security
 * rules, and response shape using MockMvc with a mocked service layer.
 */
@WebMvcTest(LessonController.class)
@Import(SecurityConfig.class)
class LessonControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    // Service mock
    @MockBean LessonService lessonService;

    // Beans needed by JwtAuthFilter
    @MockBean JwtUtil jwtUtil;
    @MockBean UserRepository userRepository;

    private Lesson lesson;

    @BeforeEach
    void setUp() {
        lesson = new Lesson();
        lesson.setTitle("Rizz 101");
        lesson.setDifficulty("BEGINNER");
        lesson.setPublished(true);
    }

    // ── Public (no auth required) ────────────────────────────────────────────

    @Test
    void getPublishedLessons_noAuth_returns200() throws Exception {
        when(lessonService.getPublishedLessons()).thenReturn(List.of(lesson));

        mockMvc.perform(get("/api/lessons"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Rizz 101"));
    }

    @Test
    void getLessonById_noAuth_returns200() throws Exception {
        when(lessonService.getPublishedLessonById(1L)).thenReturn(lesson);

        mockMvc.perform(get("/api/lessons/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Rizz 101"));
    }

    @Test
    void getLessonById_notFound_returns404() throws Exception {
        when(lessonService.getPublishedLessonById(99L))
                .thenThrow(new ResponseStatusException(NOT_FOUND, "Lesson not found"));

        mockMvc.perform(get("/api/lessons/99"))
                .andExpect(status().isNotFound());
    }

    // ── Admin-only endpoints ─────────────────────────────────────────────────

    @Test
    void createLesson_noAuth_returns403() throws Exception {
        mockMvc.perform(post("/api/lessons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("title", "New Lesson", "difficulty", "BEGINNER"))))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "LEARNER")
    void createLesson_asLearner_returns403() throws Exception {
        mockMvc.perform(post("/api/lessons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("title", "New Lesson", "difficulty", "BEGINNER"))))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createLesson_asAdmin_returns201() throws Exception {
        when(lessonService.createLesson(org.mockito.ArgumentMatchers.any())).thenReturn(lesson);

        mockMvc.perform(post("/api/lessons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("title", "Rizz 101", "difficulty", "BEGINNER",
                               "description", "Learn rizz", "objective", "Understand rizz"))))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteLesson_asAdmin_returns204() throws Exception {
        mockMvc.perform(delete("/api/lessons/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteLesson_noAuth_returns403() throws Exception {
        mockMvc.perform(delete("/api/lessons/1"))
                .andExpect(status().isForbidden());
    }
}
