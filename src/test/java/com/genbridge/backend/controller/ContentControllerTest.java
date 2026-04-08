package com.genbridge.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.genbridge.backend.config.JwtUtil;
import com.genbridge.backend.config.SecurityConfig;
import com.genbridge.backend.entity.Content;
import com.genbridge.backend.services.ContentService;
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

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for ContentController — verifies HTTP routing, security
 * rules, and response shape using MockMvc with a mocked service layer.
 */
@WebMvcTest(ContentController.class)
@Import(SecurityConfig.class)
class ContentControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    // Service mock
    @MockBean ContentService contentService;

    // Beans needed by JwtAuthFilter
    @MockBean JwtUtil jwtUtil;
    @MockBean UserRepository userRepository;

    private Content sampleContent;

    @BeforeEach
    void setUp() {
        sampleContent = new Content();
        sampleContent.setLessonId(1L);
        sampleContent.setTerm("rizz");
        sampleContent.setDescription("Natural charm or charisma");
        sampleContent.setSource("Urban Dictionary");
        sampleContent.setOrderIndex(1);
    }

    // ── Glossary endpoint ────────────────────────────────────────────────────

    @Test
    void getGlossary_noAuth_returns403() throws Exception {
        mockMvc.perform(get("/api/content/glossary"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "LEARNER")
    void getGlossary_asLearner_returns200WithAllTerms() throws Exception {
        Content term2 = new Content();
        term2.setTerm("slay");
        term2.setDescription("To do something exceptionally well");

        when(contentService.getAllContent()).thenReturn(List.of(sampleContent, term2));

        mockMvc.perform(get("/api/content/glossary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].term").value("rizz"))
                .andExpect(jsonPath("$[1].term").value("slay"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getGlossary_asAdmin_returns200() throws Exception {
        when(contentService.getAllContent()).thenReturn(List.of(sampleContent));

        mockMvc.perform(get("/api/content/glossary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].source").value("Urban Dictionary"));
    }

    // ── Content for a lesson ─────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "LEARNER")
    void getContentByLesson_asLearner_returns200() throws Exception {
        when(contentService.getContentByLesson(1L)).thenReturn(List.of(sampleContent));

        mockMvc.perform(get("/api/content/lesson/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].term").value("rizz"));
    }

    @Test
    void getContentByLesson_noAuth_returns403() throws Exception {
        mockMvc.perform(get("/api/content/lesson/1"))
                .andExpect(status().isForbidden());
    }

    // ── Admin-only write endpoints ───────────────────────────────────────────

    @Test
    void createContent_noAuth_returns403() throws Exception {
        mockMvc.perform(post("/api/content")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("lessonId", 1, "term", "rizz",
                               "description", "Charm", "orderIndex", 1))))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "LEARNER")
    void createContent_asLearner_returns403() throws Exception {
        mockMvc.perform(post("/api/content")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("lessonId", 1, "term", "rizz",
                               "description", "Charm", "orderIndex", 1))))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createContent_asAdmin_returns201() throws Exception {
        when(contentService.createContent(any())).thenReturn(sampleContent);

        mockMvc.perform(post("/api/content")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("lessonId", 1, "term", "rizz",
                               "description", "Charm", "orderIndex", 1))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.term").value("rizz"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteContent_asAdmin_returns204() throws Exception {
        mockMvc.perform(delete("/api/content/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "LEARNER")
    void deleteContent_asLearner_returns403() throws Exception {
        mockMvc.perform(delete("/api/content/1"))
                .andExpect(status().isForbidden());
    }
}
