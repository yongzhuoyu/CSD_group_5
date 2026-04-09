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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LessonServiceTest {

    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private LessonServiceImpl lessonService;

    private Lesson publishedLesson;
    private Lesson unpublishedLesson;

    @BeforeEach
    void setUp() {
        publishedLesson = new Lesson();
        publishedLesson.setTitle("Rizz 101");
        publishedLesson.setDifficulty("BEGINNER");
        publishedLesson.setPublished(true);

        unpublishedLesson = new Lesson();
        unpublishedLesson.setTitle("No Cap Deep Dive");
        unpublishedLesson.setDifficulty("INTERMEDIATE");
        unpublishedLesson.setPublished(false);
    }

    @Test
    void getPublishedLessons_returnsOnlyPublishedLessons() {
        when(lessonRepository.findByPublishedTrue()).thenReturn(List.of(publishedLesson));

        List<Lesson> result = lessonService.getPublishedLessons();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Rizz 101");
        verify(lessonRepository).findByPublishedTrue();
    }

    @Test
    void getPublishedLessonById_existingLesson_returnsLesson() {
        when(lessonRepository.findByIdAndPublishedTrue(1L)).thenReturn(Optional.of(publishedLesson));

        Lesson result = lessonService.getPublishedLessonById(1L);

        assertThat(result.getTitle()).isEqualTo("Rizz 101");
    }

    @Test
    void getPublishedLessonById_lessonNotFound_throws404() {
        when(lessonRepository.findByIdAndPublishedTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> lessonService.getPublishedLessonById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Lesson not found");
    }

    @Test
    void createLesson_validRequest_savesAndReturnsLesson() {
        LessonRequest request = new LessonRequest();
        request.setTitle("Slay Nation");
        request.setDescription("All about slay");
        request.setDifficulty("BEGINNER");
        request.setObjective("Understand slay");

        Lesson saved = new Lesson();
        saved.setTitle("Slay Nation");
        when(lessonRepository.save(any(Lesson.class))).thenReturn(saved);

        Lesson result = lessonService.createLesson(request);

        assertThat(result.getTitle()).isEqualTo("Slay Nation");
        verify(lessonRepository).save(any(Lesson.class));
    }

    @Test
    void updateLesson_lessonNotFound_throws404() {
        when(lessonRepository.findById(99L)).thenReturn(Optional.empty());

        LessonRequest request = new LessonRequest();
        request.setTitle("Updated");
        request.setDifficulty("BEGINNER");

        assertThatThrownBy(() -> lessonService.updateLesson(99L, request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Lesson not found");
    }

    @Test
    void togglePublish_unpublishedLesson_setsPublishedTrue() {
        when(lessonRepository.findById(1L)).thenReturn(Optional.of(unpublishedLesson));
        when(lessonRepository.save(any(Lesson.class))).thenAnswer(inv -> inv.getArgument(0));

        Lesson result = lessonService.togglePublish(1L);

        assertThat(result.isPublished()).isTrue();
        assertThat(result.getPublishedAt()).isNotNull();
    }

    @Test
    void togglePublish_publishedLesson_setsPublishedFalse() {
        when(lessonRepository.findById(1L)).thenReturn(Optional.of(publishedLesson));
        when(lessonRepository.save(any(Lesson.class))).thenAnswer(inv -> inv.getArgument(0));

        Lesson result = lessonService.togglePublish(1L);

        assertThat(result.isPublished()).isFalse();
        assertThat(result.getPublishedAt()).isNull();
    }

    @Test
    void deleteLesson_lessonNotFound_throws404() {
        when(lessonRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> lessonService.deleteLesson(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Lesson not found");

        verify(lessonRepository, never()).deleteById(any());
    }

    @Test
    void deleteLesson_existingLesson_callsDeleteById() {
        when(lessonRepository.existsById(1L)).thenReturn(true);

        lessonService.deleteLesson(1L);

        verify(lessonRepository).deleteById(1L);
    }
}
