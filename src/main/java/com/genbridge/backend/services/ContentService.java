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

    // LEARNER: Save content as a draft (not yet submitted for review)
    public Content saveDraft(ContentRequest request, String contributorEmail) {
        User contributor = userRepository.findByEmail(contributorEmail)
                .orElseThrow(() -> new RuntimeException("Contributor not found"));
        Content content = new Content();
        content.setTitle(request.getTitle());
        content.setDescription(request.getDescription());
        content.setTerm(request.getTerm());
        content.setContributor(contributor);
        content.setStatus("DRAFT");
        return contentRepository.save(content);
    }

    // LEARNER: Submit content for admin review
    public Content submitForReview(ContentRequest request, String contributorEmail) {
        User contributor = userRepository.findByEmail(contributorEmail)
                .orElseThrow(() -> new RuntimeException("Contributor not found"));
        Content content = new Content();
        content.setTitle(request.getTitle());
        content.setDescription(request.getDescription());
        content.setTerm(request.getTerm());
        content.setContributor(contributor);
        content.setStatus("PENDING");
        return contentRepository.save(content);
    }

    // PUBLIC: Get all approved content
    public List<Content> getApprovedContent() {
        return contentRepository.findByStatus("APPROVED");
    }

    // ADMIN: Get all content pending review
    public List<Content> getPendingContent() {
        return contentRepository.findByStatus("PENDING");
    }

    // ADMIN: Approve a piece of content
    public Content approveContent(UUID contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (!content.getStatus().equals("PENDING")) {
            throw new IllegalStateException("Only PENDING content can be approved");
        }

        content.setStatus("APPROVED");
        return contentRepository.save(content);
    }

    // ADMIN: Reject a piece of content
    public Content rejectContent(UUID contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (!content.getStatus().equals("PENDING")) {
            throw new IllegalStateException("Only PENDING content can be rejected");
        }

        content.setStatus("REJECTED");
        return contentRepository.save(content);
    }

    // ADMIN: Delete a piece of content
    public void deleteContent(UUID contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        contentRepository.delete(content);
    }
}
