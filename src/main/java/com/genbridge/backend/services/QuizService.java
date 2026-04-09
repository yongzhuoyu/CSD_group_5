package com.genbridge.backend.services;

import com.genbridge.backend.dto.CreateQuizQuestionRequest;
import com.genbridge.backend.dto.SubmitQuizRequest;
import com.genbridge.backend.entity.QuizQuestion;
import com.genbridge.backend.user.User;

import java.util.List;
import java.util.Map;

/** Defines operations for quiz question management and quiz submission scoring. */
public interface QuizService {
    List<Map<String, Object>> getQuizForLesson(Long lessonId);
    QuizQuestion createQuizQuestion(Long lessonId, CreateQuizQuestionRequest request);
    Map<String, Object> submitQuiz(Long lessonId, SubmitQuizRequest request, User user);
    QuizQuestion updateQuizQuestion(Long lessonId, Long questionId, CreateQuizQuestionRequest request);
    void deleteQuizQuestion(Long lessonId, Long questionId);
    Map<String, Object> answerQuestion(Long lessonId, Long questionId, Integer selectedIndex, User user);
}
