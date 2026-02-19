package com.genbridge.backend.services;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.entity.Content;
import com.genbridge.backend.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ContentService {
    
    @Autowired
    private ContentRepository contentRepository;
    
    public Content createContent(ContentRequest request, Long contributorId) {
        Content content = new Content();
        content.setTitle(request.getTitle());
        content.setDescription(request.getDescription());
        content.setTerm(request.getTerm());
        content.setContributorId(contributorId);  // FIXED: Set Long directly
        content.setPublished(false);
        return contentRepository.save(content);
    }
}
