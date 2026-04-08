package com.genbridge.backend.controller;

import com.genbridge.backend.repository.LessonProgressRepository;
import com.genbridge.backend.repository.LessonRepository;
import com.genbridge.backend.repository.QuestCompletionRepository;
import com.genbridge.backend.repository.ForumPostRepository;
import com.genbridge.backend.user.User;
import com.genbridge.backend.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AnalyticsController {

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final QuestCompletionRepository questCompletionRepository;
    private final ForumPostRepository forumPostRepository;

    public AnalyticsController(UserRepository userRepository,
                                LessonRepository lessonRepository,
                                LessonProgressRepository lessonProgressRepository,
                                QuestCompletionRepository questCompletionRepository,
                                ForumPostRepository forumPostRepository) {
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.questCompletionRepository = questCompletionRepository;
        this.forumPostRepository = forumPostRepository;
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        List<User> allUsers = userRepository.findAll();
        List<User> learners = allUsers.stream()
                .filter(u -> !"ADMIN".equals(u.getRole()))
                .collect(Collectors.toList());

        long totalUsers = learners.size();
        long suspendedUsers = learners.stream().filter(User::isSuspended).count();
        long totalLessons = lessonRepository.count();
        long publishedLessons = lessonRepository.findByPublishedTrue().size();
        long totalQuestCompletions = questCompletionRepository.count();
        long totalForumPosts = forumPostRepository.count();

        // Lesson completion rates
        List<Map<String, Object>> lessonStats = lessonRepository.findAll().stream()
                .filter(l -> l.isPublished())
                .map(lesson -> {
                    long completions = lessonProgressRepository.findAll().stream()
                            .filter(p -> p.getLessonId().equals(lesson.getId()) && p.isCompleted())
                            .count();
                    double rate = totalUsers == 0 ? 0 : Math.round((completions * 100.0 / totalUsers) * 10) / 10.0;
                    Map<String, Object> stat = new HashMap<>();
                    stat.put("lessonId", lesson.getId());
                    stat.put("title", lesson.getTitle());
                    stat.put("difficulty", lesson.getDifficulty());
                    stat.put("completions", completions);
                    stat.put("completionRate", rate);
                    return stat;
                })
                .sorted((a, b) -> Long.compare((long) b.get("completions"), (long) a.get("completions")))
                .collect(Collectors.toList());

        // Active users (streak > 0)
        long activeUsers = learners.stream().filter(u -> u.getCurrentStreak() > 0).count();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalUsers", totalUsers);
        analytics.put("activeUsers", activeUsers);
        analytics.put("suspendedUsers", suspendedUsers);
        analytics.put("totalLessons", totalLessons);
        analytics.put("publishedLessons", publishedLessons);
        analytics.put("totalQuestCompletions", totalQuestCompletions);
        analytics.put("totalForumPosts", totalForumPosts);
        analytics.put("lessonStats", lessonStats);

        return ResponseEntity.ok(analytics);
    }
}
