package com.genbridge.backend.services.impl;

import com.genbridge.backend.dto.LessonRequest;
import com.genbridge.backend.entity.Lesson;
import com.genbridge.backend.repository.LessonRepository;
import com.genbridge.backend.services.LessonService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of {@link LessonService}.
 * Manages lessons including CRUD operations and publish/unpublish toggling.
 * All methods run within a transaction; read-only queries use a read-only transaction hint.
 */
@Service
@Transactional
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;

    public LessonServiceImpl(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    @Override
    public List<Lesson> getPublishedLessons() {
        return lessonRepository.findByPublishedTrue();
    }

    @Override
    public Lesson getPublishedLessonById(Long id) {
        return lessonRepository.findByIdAndPublishedTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));
    }

    @Override
    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    @Override
    public Lesson createLesson(LessonRequest request) {
        Lesson lesson = new Lesson();
        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setDifficulty(request.getDifficulty());
        lesson.setObjective(request.getObjective());
        return lessonRepository.save(lesson);
    }

    @Override
    public Lesson updateLesson(Long id, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));
        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setDifficulty(request.getDifficulty());
        lesson.setObjective(request.getObjective());
        lesson.setUpdatedAt(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }

    @Override
    public Lesson togglePublish(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));
        boolean nowPublished = !lesson.isPublished();
        lesson.setPublished(nowPublished);
        lesson.setPublishedAt(nowPublished ? LocalDateTime.now() : null);
        lesson.setUpdatedAt(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }

    @Override
    public void deleteLesson(Long id) {
        if (!lessonRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found");
        }
        lessonRepository.deleteById(id);
    }
}
