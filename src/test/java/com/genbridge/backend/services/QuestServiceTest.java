package com.genbridge.backend.services;

import com.genbridge.backend.dto.QuestCompletionRequest;
import com.genbridge.backend.dto.QuestRequest;
import com.genbridge.backend.entity.Quest;
import com.genbridge.backend.entity.QuestCompletion;
import com.genbridge.backend.repository.QuestCompletionRepository;
import com.genbridge.backend.repository.QuestRepository;
import com.genbridge.backend.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestServiceTest {

    @Mock
    private QuestRepository questRepository;

    @Mock
    private QuestCompletionRepository questCompletionRepository;

    @InjectMocks
    private QuestServiceImpl questService;

    private User user;
    private Quest quest;

    @BeforeEach
    void setUp() {
        user = new User("Alice", "alice@test.com", "hash", "LEARNER");

        quest = new Quest();
        quest.setId(1L);
        quest.setTitle("Go outside");
        quest.setDescription("Take a walk");
        quest.setInstruction("Walk 10 minutes");
        quest.setPublished(true);

        // Put user into Spring Security context so getCurrentUser() works
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null,
                        List.of(new SimpleGrantedAuthority("ROLE_LEARNER")));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void createQuest_savesAndReturns() {
        QuestRequest request = new QuestRequest();
        request.setTitle("New Quest");
        request.setDescription("Desc");
        request.setInstruction("Do it");
        request.setPublished(true);

        when(questRepository.save(any(Quest.class))).thenAnswer(inv -> inv.getArgument(0));
        Quest result = questService.createQuest(request);

        assertThat(result.getTitle()).isEqualTo("New Quest");
        assertThat(result.isPublished()).isTrue();
    }

    @Test
    void updateQuest_notFound_throws404() {
        when(questRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> questService.updateQuest(99L, new QuestRequest()))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Quest not found");
    }

    @Test
    void updateQuest_found_updatesFields() {
        QuestRequest request = new QuestRequest();
        request.setTitle("Updated Quest");
        request.setDescription("New Desc");
        request.setInstruction("New instruction");
        request.setPublished(false);

        when(questRepository.findById(1L)).thenReturn(Optional.of(quest));
        when(questRepository.save(any(Quest.class))).thenAnswer(inv -> inv.getArgument(0));

        Quest result = questService.updateQuest(1L, request);
        assertThat(result.getTitle()).isEqualTo("Updated Quest");
        assertThat(result.isPublished()).isFalse();
    }

    @Test
    void deleteQuest_notFound_throws404() {
        when(questRepository.existsById(99L)).thenReturn(false);
        assertThatThrownBy(() -> questService.deleteQuest(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Quest not found");
    }

    @Test
    void deleteQuest_found_deletes() {
        when(questRepository.existsById(1L)).thenReturn(true);
        questService.deleteQuest(1L);
        verify(questRepository).deleteById(1L);
    }

    @Test
    void completeQuest_alreadyCompleted_throws400() {
        when(questRepository.findByIdAndIsPublishedTrue(1L)).thenReturn(Optional.of(quest));
        when(questCompletionRepository.existsByQuestAndUser(quest, user)).thenReturn(true);

        QuestCompletionRequest request = new QuestCompletionRequest();
        request.setReflection("Great experience");

        assertThatThrownBy(() -> questService.completeQuest(1L, request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("already completed");
    }

    @Test
    void completeQuest_firstTime_savesCompletion() {
        when(questRepository.findByIdAndIsPublishedTrue(1L)).thenReturn(Optional.of(quest));
        when(questCompletionRepository.existsByQuestAndUser(quest, user)).thenReturn(false);
        when(questCompletionRepository.save(any(QuestCompletion.class))).thenAnswer(inv -> inv.getArgument(0));

        QuestCompletionRequest request = new QuestCompletionRequest();
        request.setReflection("Amazing");

        QuestCompletion result = questService.completeQuest(1L, request);
        assertThat(result.getReflection()).isEqualTo("Amazing");
        verify(questCompletionRepository).save(any(QuestCompletion.class));
    }
}
