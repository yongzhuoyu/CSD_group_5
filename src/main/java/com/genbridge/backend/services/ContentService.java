package com.genbridge.backend.services;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.dto.ContentResponse;
import com.genbridge.backend.dto.ModerationResponse;
import com.genbridge.backend.dto.RejectRequest;
import com.genbridge.backend.entity.*;
import com.genbridge.backend.repository.*;
import com.genbridge.backend.user.User;
import com.genbridge.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ContentService {

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ContentReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    private final List<String> allowedReasons = List.of(
            "Inaccurate",
            "Inappropriate",
            "Poor Quality",
            "Other");

    // ===============================
    // USER - SAVE DRAFT
    // ===============================

    public Content saveDraft(ContentRequest request, String email) {

        User user = userRepository.findByEmail(email).orElseThrow();
        Category category = categoryRepository
                .findBySlug(request.getCategorySlug())
                .orElseThrow();

        Content content = new Content();
        content.setTitle(request.getTitle());
        content.setTerm(request.getTerm());
        content.setBody(request.getBody());
        content.setCategory(category);
        content.setCreatedBy(user);
        content.setStatus(Content.STATUS_DRAFT);

        return contentRepository.save(content);
    }

    // ===============================
    // USER - SUBMIT
    // ===============================

    public Content submitForReview(ContentRequest request, String email) {

        User user = userRepository.findByEmail(email).orElseThrow();
        Category category = categoryRepository
                .findBySlug(request.getCategorySlug())
                .orElseThrow();

        Content content = new Content();
        content.setTitle(request.getTitle());
        content.setTerm(request.getTerm());
        content.setBody(request.getBody());
        content.setCategory(category);
        content.setCreatedBy(user);
        content.setStatus(Content.STATUS_PENDING);

        return contentRepository.save(content);
    }

    // ===============================
    // USER - APPROVED CONTENT (PUBLIC)
    // ===============================

    public List<ContentResponse> getApprovedContent() {

        return contentRepository.findByStatus(Content.STATUS_APPROVED)
                .stream()
                .map(this::mapBasicContentResponse)
                .toList();
    }

    // ===============================
    // USER - PENDING CONTENT (ADMIN VIEW)
    // ===============================

    public List<ContentResponse> getPendingContent() {

        return contentRepository.findByStatus(Content.STATUS_PENDING)
                .stream()
                .map(this::mapBasicContentResponse)
                .toList();
    }

    // ===============================
    // USER - MY SUBMISSIONS
    // ===============================

    public List<ContentResponse> getMySubmissions(String email) {

        User user = userRepository.findByEmail(email).orElseThrow();

        return contentRepository.findByCreatedBy_Id(user.getId())
                .stream()
                .map(c -> {

                    String reason = null;
                    String comment = null;

                    if (Content.STATUS_REJECTED.equals(c.getStatus())) {

                        ContentReview latestReview = reviewRepository
                                .findTopByContent_IdOrderByReviewedAtDesc(c.getId())
                                .orElse(null);

                        if (latestReview != null) {
                            reason = latestReview.getReason();
                            comment = latestReview.getComment();
                        }
                    }

                    return new ContentResponse(
                            c.getId(),
                            c.getTitle(),
                            c.getTerm(),
                            c.getBody(),
                            c.getCategory().getName(),
                            c.getCategory().getSlug(),
                            c.getCategory().getDescription(),
                            c.getStatus(),
                            reason,
                            comment);
                })
                .toList();
    }

    // ===============================
    // UPDATE CONTENT
    // ===============================

    public ContentResponse updateContent(UUID id,
            ContentRequest request,
            String email) {

        User user = userRepository.findByEmail(email).orElseThrow();
        Content content = contentRepository.findById(id).orElseThrow();

        if (!content.getCreatedBy().getId().equals(user.getId()))
            throw new RuntimeException("You can only edit your own content");

        if (content.getStatus().equals(Content.STATUS_APPROVED))
            throw new RuntimeException("Approved content cannot be edited");

        Category category = categoryRepository
                .findBySlug(request.getCategorySlug())
                .orElseThrow();

        content.setTitle(request.getTitle());
        content.setTerm(request.getTerm());
        content.setBody(request.getBody());
        content.setCategory(category);

        if (request.isSubmit()) {
            content.setStatus(Content.STATUS_PENDING);
        }

        contentRepository.save(content);

        return mapBasicContentResponse(content);
    }

    // ===============================
    // DELETE
    // ===============================

    public void deleteContent(UUID id) {
        contentRepository.deleteById(id);
    }

    // ===============================
    // MODERATION
    // ===============================

    private void ensureAdmin(User user) {
        if (!"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Only ADMIN can perform this action");
        }
    }

    public ModerationResponse approveContent(UUID id, User moderator) {

        ensureAdmin(moderator);

        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (!Content.STATUS_PENDING.equals(content.getStatus()))
            throw new IllegalStateException("Only PENDING content can be approved");

        content.setStatus(Content.STATUS_APPROVED);

        ContentReview review = new ContentReview();
        review.setContent(content);
        review.setReviewedBy(moderator);
        review.setDecision("APPROVED");
        review.setReviewedAt(LocalDateTime.now());

        reviewRepository.save(review);
        contentRepository.save(content);

        return new ModerationResponse(
                content.getId(),
                content.getStatus(),
                moderator.getEmail(),
                review.getReviewedAt());
    }

    public ModerationResponse rejectContent(UUID id,
            RejectRequest request,
            User moderator) {

        ensureAdmin(moderator);

        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (!Content.STATUS_PENDING.equals(content.getStatus()))
            throw new IllegalStateException("Only PENDING content can be rejected");

        if (!allowedReasons.contains(request.getReason()))
            throw new IllegalArgumentException("Invalid rejection reason");

        if ("Other".equals(request.getReason()) &&
                (request.getComment() == null || request.getComment().isBlank()))
            throw new IllegalArgumentException("Comment required when reason is Other");

        content.setStatus(Content.STATUS_REJECTED);

        ContentReview review = new ContentReview();
        review.setContent(content);
        review.setReviewedBy(moderator);
        review.setDecision("REJECTED");
        review.setReason(request.getReason());
        review.setComment(request.getComment());
        review.setReviewedAt(LocalDateTime.now());

        reviewRepository.save(review);
        contentRepository.save(content);

        return new ModerationResponse(
                content.getId(),
                content.getStatus(),
                moderator.getEmail(),
                review.getReviewedAt());
    }

    // ===============================
    // ADMIN DASHBOARD
    // ===============================

    public record AdminStats(long pending, long approved, long rejected) {
    }

    public AdminStats getAdminStats(User admin) {

        ensureAdmin(admin);

        return new AdminStats(
                contentRepository.countByStatus(Content.STATUS_PENDING),
                contentRepository.countByStatus(Content.STATUS_APPROVED),
                contentRepository.countByStatus(Content.STATUS_REJECTED));
    }

    public List<ContentResponse> getApprovedByAdmin(User admin) {

        ensureAdmin(admin);

        return reviewRepository
                .findByReviewedByAndDecisionOrderByReviewedAtDesc(admin, "APPROVED")
                .stream()
                .map(r -> mapBasicContentResponse(r.getContent()))
                .toList();
    }

    public List<ContentResponse> getRejectedByAdmin(User admin) {

        ensureAdmin(admin);

        return reviewRepository
                .findByReviewedByAndDecisionOrderByReviewedAtDesc(admin, "REJECTED")
                .stream()
                .map(r -> mapBasicContentResponse(r.getContent()))
                .toList();
    }

    // ===============================
    // HELPER MAPPER
    // ===============================

    private ContentResponse mapBasicContentResponse(Content c) {

        return new ContentResponse(
                c.getId(),
                c.getTitle(),
                c.getTerm(),
                c.getBody(),
                c.getCategory().getName(),
                c.getCategory().getSlug(),
                c.getCategory().getDescription(),
                c.getStatus());
    }
}