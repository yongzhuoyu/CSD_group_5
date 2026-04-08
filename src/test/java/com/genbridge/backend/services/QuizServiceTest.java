package com.genbridge.backend.services;

import com.genbridge.backend.dto.CreateQuizQuestionRequest;
import com.genbridge.backend.entity.QuizQuestion;
import com.genbridge.backend.repository.LessonProgressRepository;
import com.genbridge.backend.repository.LessonRepository;
import com.genbridge.backend.repository.QuizAttemptRepository;
import com.genbridge.backend.repository.QuizQuestionRepository;
import com.genbridge.backend.user.User;
import com.genbridge.backend.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock private QuizQuestionRepository quizQuestionRepository;
    @Mock private QuizAttemptRepository quizAttemptRepository;
    @Mock private LessonProgressRepository lessonProgressRepository;
    @Mock private LessonRepository lessonRepository;
    @Mock private UserService userService;

    @InjectMocks
    private QuizService quizService;

    private User user;
    private QuizQuestion question;

    @BeforeEach
    void setUp() {
        user = new User("Alice", "alice@test.com", "hash", "LEARNER");

        question = new QuizQuestion();
        question.setId(1L);
        question.setLessonId(1L);
        question.setQuestionText("What is NPC?");
        question.setOptionA("A video game character");
        question.setOptionB("A food");
        question.setOptionC("A dance");
        question.setOptionD("A meme");
        question.setCorrectIndex(0);
        question.setExplanation("NPC stands for Non-Playable Character");
    }

    @Test
    void getQuizForLesson_lessonNotFound_throws() {
        when(lessonRepository.existsById(99L)).thenReturn(false);
        assertThatThrownBy(() -> quizService.getQuizForLesson(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Lesson not found");
    }

    @Test
    void getQuizForLesson_returnsQuestions() {
        when(lessonRepository.existsById(1L)).thenReturn(true);
        when(quizQuestionRepository.findByLessonIdOrderByIdAsc(1L)).thenReturn(List.of(question));

        List<Map<String, Object>> result = quizService.getQuizForLesson(1L);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).get("questionText")).isEqualTo("What is NPC?");
    }

    @Test
    void createQuizQuestion_invalidOptions_throws() {
        when(lessonRepository.existsById(1L)).thenReturn(true);

        CreateQuizQuestionRequest request = new CreateQuizQuestionRequest();
        request.setQuestionText("Q?");
        request.setOptions(List.of("A", "B")); // only 2 options
        request.setCorrectIndex(0);

        assertThatThrownBy(() -> quizService.createQuizQuestion(1L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("4 options");
    }

    @Test
    void createQuizQuestion_valid_saves() {
        when(lessonRepository.existsById(1L)).thenReturn(true);
        when(quizQuestionRepository.save(any(QuizQuestion.class))).thenAnswer(inv -> inv.getArgument(0));

        CreateQuizQuestionRequest request = new CreateQuizQuestionRequest();
        request.setQuestionText("What is NPC?");
        request.setOptions(List.of("A", "B", "C", "D"));
        request.setCorrectIndex(0);
        request.setExplanation("Explanation");

        QuizQuestion result = quizService.createQuizQuestion(1L, request);
        assertThat(result.getQuestionText()).isEqualTo("What is NPC?");
        assertThat(result.getCorrectIndex()).isEqualTo(0);
    }

    @Test
    void updateQuizQuestion_questionNotFound_throws() {
        when(lessonRepository.existsById(1L)).thenReturn(true);
        when(quizQuestionRepository.findById(99L)).thenReturn(Optional.empty());

        CreateQuizQuestionRequest request = new CreateQuizQuestionRequest();
        request.setOptions(List.of("A", "B", "C", "D"));

        assertThatThrownBy(() -> quizService.updateQuizQuestion(1L, 99L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Question not found");
    }

    @Test
    void deleteQuizQuestion_questionBelongsToWrongLesson_throws() {
        when(lessonRepository.existsById(1L)).thenReturn(true);
        question.setLessonId(2L); // belongs to lesson 2, not 1
        when(quizQuestionRepository.findById(1L)).thenReturn(Optional.of(question));

        assertThatThrownBy(() -> quizService.deleteQuizQuestion(1L, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("does not belong");
    }
}
