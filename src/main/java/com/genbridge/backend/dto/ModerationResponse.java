package com.genbridge.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ModerationResponse {

    private UUID contentId;
    private String status;
    private String moderatorEmail;
    private LocalDateTime reviewedAt;

    public ModerationResponse(UUID contentId,
            String status,
            String moderatorEmail,
            LocalDateTime reviewedAt) {
        this.contentId = contentId;
        this.status = status;
        this.moderatorEmail = moderatorEmail;
        this.reviewedAt = reviewedAt;
    }

    public UUID getContentId() {
        return contentId;
    }

    public String getStatus() {
        return status;
    }

    public String getModeratorEmail() {
        return moderatorEmail;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }
}