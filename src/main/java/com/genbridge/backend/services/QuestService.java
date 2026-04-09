package com.genbridge.backend.services;

import com.genbridge.backend.dto.QuestCompletionRequest;
import com.genbridge.backend.dto.QuestRequest;
import com.genbridge.backend.entity.Quest;
import com.genbridge.backend.entity.QuestCompletion;

import java.util.List;
import java.util.Map;

/** Defines operations for managing quests and quest completions. */
public interface QuestService {
    List<Map<String, Object>> getPublishedQuestsForCurrentUser();
    Map<String, Object> getPublishedQuestByIdForCurrentUser(Long id);
    QuestCompletion completeQuest(Long questId, QuestCompletionRequest request);
    List<Map<String, Object>> getCurrentUserCompletions();
    List<Quest> getAllQuests();
    Quest createQuest(QuestRequest request);
    Quest updateQuest(Long id, QuestRequest request);
    void deleteQuest(Long id);
}
