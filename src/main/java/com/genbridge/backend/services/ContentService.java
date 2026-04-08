package com.genbridge.backend.services;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.entity.Content;
import com.genbridge.backend.repository.ContentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for managing content terms (slang entries) attached to lessons.
 * Supports per-lesson retrieval, a global glossary view, and full CRUD for admins.
 */
@Service
@Transactional
public class ContentService {

    private final ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    /** Returns all content terms for the given lesson, ordered by their display index. */
    public List<Content> getContentByLesson(Long lessonId) {
        return contentRepository.findByLessonIdOrderByOrderIndex(lessonId);
    }

    /** Returns every content term across all lessons, sorted alphabetically — used by the Glossary page. */
    public List<Content> getAllContent() {
        return contentRepository.findAllByOrderByTermAsc();
    }

    public Content createContent(ContentRequest request) {
        Content content = new Content();
        content.setLessonId(request.getLessonId());
        content.setTerm(request.getTerm());
        content.setDescription(request.getDescription());
        content.setExample(request.getExample());
        content.setSource(request.getSource());
        content.setOrderIndex(request.getOrderIndex());
        return contentRepository.save(content);
    }

    public Content updateContent(Long id, ContentRequest request) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Content not found"));
        content.setTerm(request.getTerm());
        content.setDescription(request.getDescription());
        content.setExample(request.getExample());
        content.setSource(request.getSource());
        content.setOrderIndex(request.getOrderIndex());
        content.setUpdatedAt(LocalDateTime.now());
        return contentRepository.save(content);
    }

    public void deleteContent(Long id) {
        if (!contentRepository.existsById(id)) {
            throw new IllegalArgumentException("Content not found");
        }
        contentRepository.deleteById(id);
    }
}
