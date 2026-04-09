package com.genbridge.backend.services;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.entity.Content;

import java.util.List;

/** Defines CRUD operations for content terms (slang entries) attached to lessons. */
public interface ContentService {
    List<Content> getContentByLesson(Long lessonId);
    List<Content> getAllContent();
    Content createContent(ContentRequest request);
    Content updateContent(Long id, ContentRequest request);
    void deleteContent(Long id);
}
