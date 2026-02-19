package com.genbridge.backend.services;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.entity.Content;
import com.genbridge.backend.repository.ContentRepository;
import com.genbridge.backend.user.User;
import com.genbridge.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ContentService {

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private UserRepository userRepository;

    public Content saveDraft(ContentRequest request, UUID contributorId) {
        User contributor = userRepository.findById(contributorId)
                .orElseThrow(() -> new RuntimeException("Contributor not found"));
        Content content = new Content();
        content.setTitle(request.getTitle());
        content.setDescription(request.getDescription());
        content.setTerm(request.getTerm());
        content.setContributor(contributor);
        content.setStatus("DRAFT");
        return contentRepository.save(content);
    }

    public Content submitForReview(ContentRequest request, UUID contributorId) {
        User contributor = userRepository.findById(contributorId)
                .orElseThrow(() -> new RuntimeException("Contributor not found"));
        Content content = new Content();
        content.setTitle(request.getTitle());
        content.setDescription(request.getDescription());
        content.setTerm(request.getTerm());
        content.setContributor(contributor);
        content.setStatus("PENDING");
        return contentRepository.save(content);
    }

    public List<Content> getApprovedContent() {
        return contentRepository.findByStatus("APPROVED");
    }

    // Admin methods
    public Content approveContent(UUID contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        content.setStatus("APPROVED");
        return contentRepository.save(content);
    }

    public Content rejectContent(UUID contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        content.setStatus("REJECTED");
        return contentRepository.save(content);
    }

    public void deleteContent(UUID contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        contentRepository.delete(content);
    }

    public List<Content> getPendingContent() {
        return contentRepository.findByStatus("PENDING");
    }
}
