package com.genbridge.backend.content;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class ContentService {

    private final ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    public List<Content> getApprovedContent() {
        return contentRepository.findByApprovedTrue();
    }

    public Content getContentById(UUID id) {
        return contentRepository.findById(id).orElse(null);
    }

}
