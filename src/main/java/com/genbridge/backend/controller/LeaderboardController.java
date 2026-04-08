package com.genbridge.backend.controller;

import com.genbridge.backend.entity.LessonProgress;
import com.genbridge.backend.repository.LessonProgressRepository;
import com.genbridge.backend.repository.LessonRepository;
import com.genbridge.backend.repository.QuestCompletionRepository;
import com.genbridge.backend.user.User;
import com.genbridge.backend.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class LeaderboardController {

    private final UserRepository userRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final LessonRepository lessonRepository;
    private final QuestCompletionRepository questCompletionRepository;

    public LeaderboardController(UserRepository userRepository,
                                  LessonProgressRepository lessonProgressRepository,
                                  LessonRepository lessonRepository,
                                  QuestCompletionRepository questCompletionRepository) {
        this.userRepository = userRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonRepository = lessonRepository;
        this.questCompletionRepository = questCompletionRepository;
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        List<User> users = userRepository.findAll();

        List<Map<String, Object>> leaderboard = users.stream()
                .filter(u -> !"ADMIN".equals(u.getRole()))
                .map(user -> {
                    List<LessonProgress> completed = lessonProgressRepository
                            .findByUserIdOrderByLessonIdAsc(user.getId())
                            .stream()
                            .filter(LessonProgress::isCompleted)
                            .collect(Collectors.toList());

                    int lessonXp = completed.stream()
                            .mapToInt(p -> lessonRepository.findById(p.getLessonId())
                                    .map(l -> {
                                        String diff = l.getDifficulty();
                                        if ("INTERMEDIATE".equalsIgnoreCase(diff)) return 15;
                                        if ("ADVANCED".equalsIgnoreCase(diff)) return 20;
                                        return 10;
                                    })
                                    .orElse(10))
                            .sum();

                    int questXp = questCompletionRepository.findByUserOrderByCompletedAtDesc(user).size() * 15;
                    int xp = lessonXp + questXp;

                    Map<String, Object> entry = new HashMap<>();
                    entry.put("id", user.getId());
                    entry.put("name", user.getName());
                    entry.put("xp", xp);
                    entry.put("completedLessons", completed.size());
                    entry.put("currentStreak", user.getCurrentStreak());
                    return entry;
                })
                .sorted((a, b) -> Integer.compare((int) b.get("xp"), (int) a.get("xp")))
                .limit(5)
                .collect(Collectors.toList());

        // Add rank
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).put("rank", i + 1);
        }

        return ResponseEntity.ok(leaderboard);
    }
}
