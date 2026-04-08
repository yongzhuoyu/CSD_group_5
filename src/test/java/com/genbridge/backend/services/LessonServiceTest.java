package com.genbridge.backend.services;

import com.genbridge.backend.dto.LessonRequest;
import com.genbridge.backend.entity.Lesson;
import com.genbridge.backend.repository.LessonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LessonServiceTest {

    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private LessonService lessonService;

    private Lesson lesson;

    @BeforeEach
    void setUp() {
        lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTitle("Test Lesson");
        lesson.setDescription("Description");
        lesson.setDifficulty("BEGINNER");
        lesson.setObjective("Objective");
        lesson.setPublished(true);
    }

    @Test
    void getPublishedLessons_returnsOnlyPublished() {
        when(lessonRepository.findByPublishedTrue()).thenReturn(List.of(lesson));
        List<Lesson> result = lessonService.getPublishedLessons();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Lesson");
    }

    @Test
    void getPublishedLessonById_found_returnsLesson() {
        when(lessonRepository.findByIdAndPublishedTrue(1L)).thenReturn(Optional.of(lesson));
        Lesson result = lessonService.getPublishedLessonById(1L);
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void getPublishedLessonById_notFound_throws404() {
        when(lessonRepository.findByIdAndPublishedTrue(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> lessonService.getPublishedLessonById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Lesson not found");
    }

    @Test
    void createLesson_savesAndReturnsLesson() {
        LessonRequest request = new LessonRequest();
        request.setTitle("New Lesson");
        request.setDescription("Desc");
        request.setDifficulty("INTERMEDIATE");
        request.setObjective("Obj");

        when(lessonRepository.save(any(Lesson.class))).thenAnswer(inv -> inv.getArgument(0));
        Lesson result = lessonService.createLesson(request);

        assertThat(result.getTitle()).isEqualTo("New Lesson");
        assertThat(result.getDifficulty()).isEqualTo("INTERMEDIATE");
        verify(lessonRepository).save(any(Lesson.class));
    }

    @Test
    void updateLesson_notFound_throws404() {
        when(lessonRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> lessonService.updateLesson(99L, new LessonRequest()))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Lesson not found");
    }

    @Test
    void updateLesson_found_updatesFields() {
        LessonRequest request = new LessonRequest();
        request.setTitle("Updated");
        request.setDescription("New Desc");
        request.setDifficulty("ADVANCED");
        request.setObjective("New Obj");

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(lessonRepository.save(any(Lesson.class))).thenAnswer(inv -> inv.getArgument(0));

        Lesson result = lessonService.updateLesson(1L, request);
        assertThat(result.getTitle()).isEqualTo("Updated");
        assertThat(result.getDifficulty()).isEqualTo("ADVANCED");
    }

    @Test
    void togglePublish_publishedLesson_unpublishes() {
        lesson.setPublished(true);
        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(lessonRepository.save(any(Lesson.class))).thenAnswer(inv -> inv.getArgument(0));

        Lesson result = lessonService.togglePublish(1L);
        assertThat(result.isPublished()).isFalse();
    }

    @Test
    void togglePublish_unpublishedLesson_publishes() {
        lesson.setPublished(false);
        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(lessonRepository.save(any(Lesson.class))).thenAnswer(inv -> inv.getArgument(0));

        Lesson result = lessonService.togglePublish(1L);
        assertThat(result.isPublished()).isTrue();
    }

    @Test
    void deleteLesson_notFound_throws404() {
        when(lessonRepository.existsById(99L)).thenReturn(false);
        assertThatThrownBy(() -> lessonService.deleteLesson(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Lesson not found");
    }

    @Test
    void deleteLesson_found_deletesLesson() {
        when(lessonRepository.existsById(1L)).thenReturn(true);
        lessonService.deleteLesson(1L);
        verify(lessonRepository).deleteById(1L);
    }
}
