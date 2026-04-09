package com.genbridge.backend.services;

import com.genbridge.backend.entity.LessonProgress;
import com.genbridge.backend.user.User;

import java.util.Map;

/** Defines operations for tracking lesson progress per user. */
public interface ProgressService {
    LessonProgress startLesson(Long lessonId, User user);
    Map<String, Object> getProgress(User user);
}
