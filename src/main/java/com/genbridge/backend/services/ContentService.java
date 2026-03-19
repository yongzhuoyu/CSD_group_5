package com.genbridge.backend.services;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.entity.Content;
import com.genbridge.backend.repository.ContentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ContentService {

    private final ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    public List<Content> getContentByLesson(Long lessonId) {
        return contentRepository.findByLessonIdOrderByOrderIndex(lessonId);
    }

    public Content createContent(ContentRequest request) {
        Content content = new Content();
        content.setLessonId(request.getLessonId());
        content.setTitle(request.getTitle());
        content.setTerm(request.getTerm());
        content.setDescription(request.getDescription());
        content.setExample(request.getExample());
        content.setOrderIndex(request.getOrderIndex());
        return contentRepository.save(content);
    }

    public Content updateContent(Long id, ContentRequest request) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Content not found"));
        content.setTitle(request.getTitle());
        content.setTerm(request.getTerm());
        content.setDescription(request.getDescription());
        content.setExample(request.getExample());
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
