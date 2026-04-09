package com.genbridge.backend.services;

import com.genbridge.backend.dto.LessonRequest;
import com.genbridge.backend.entity.Lesson;

import java.util.List;

/** Defines CRUD operations and publish/unpublish toggling for lessons. */
public interface LessonService {
    List<Lesson> getPublishedLessons();
    Lesson getPublishedLessonById(Long id);
    List<Lesson> getAllLessons();
    Lesson createLesson(LessonRequest request);
    Lesson updateLesson(Long id, LessonRequest request);
    Lesson togglePublish(Long id);
    void deleteLesson(Long id);
}
