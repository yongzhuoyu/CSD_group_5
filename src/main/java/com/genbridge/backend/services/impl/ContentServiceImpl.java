package com.genbridge.backend.services.impl;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.entity.Content;
import com.genbridge.backend.repository.ContentRepository;
import com.genbridge.backend.services.ContentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of {@link ContentService}.
 * Manages content terms (slang entries) attached to lessons,
 * including per-lesson retrieval, glossary view, and full CRUD for admins.
 */
@Service
@Transactional
public class ContentServiceImpl implements ContentService {

    private final ContentRepository contentRepository;

    public ContentServiceImpl(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @Override
    public List<Content> getContentByLesson(Long lessonId) {
        return contentRepository.findByLessonIdOrderByOrderIndex(lessonId);
    }

    @Override
    public List<Content> getAllContent() {
        return contentRepository.findAllByOrderByTermAsc();
    }

    @Override
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

    @Override
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

    @Override
    public void deleteContent(Long id) {
        if (!contentRepository.existsById(id)) {
            throw new IllegalArgumentException("Content not found");
        }
        contentRepository.deleteById(id);
    }
}
