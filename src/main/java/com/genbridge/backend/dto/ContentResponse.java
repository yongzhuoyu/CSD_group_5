package com.genbridge.backend.dto;

import java.util.UUID;

public class ContentResponse {

    private UUID id;
    private String title;
    private String term;
    private String body;
    private String categoryName;
    private String categorySlug;
    private String categoryDescription;
    private String status;

    private String rejectionReason;
    private String rejectionComment;

    // FULL CONSTRUCTOR (10 params)
    public ContentResponse(
            UUID id,
            String title,
            String term,
            String body,
            String categoryName,
            String categorySlug,
            String categoryDescription,
            String status,
            String rejectionReason,
            String rejectionComment) {
        this.id = id;
        this.title = title;
        this.term = term;
        this.body = body;
        this.categoryName = categoryName;
        this.categorySlug = categorySlug;
        this.categoryDescription = categoryDescription;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.rejectionComment = rejectionComment;
    }

    // 🔥 OVERLOADED CONSTRUCTOR (8 params)
    public ContentResponse(
            UUID id,
            String title,
            String term,
            String body,
            String categoryName,
            String categorySlug,
            String categoryDescription,
            String status) {
        this(
                id,
                title,
                term,
                body,
                categoryName,
                categorySlug,
                categoryDescription,
                status,
                null,
                null);
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getTerm() {
        return term;
    }

    public String getBody() {
        return body;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getCategorySlug() {
        return categorySlug;
    }

    public String getCategoryDescription() {
        return categoryDescription;
    }

    public String getStatus() {
        return status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public String getRejectionComment() {
        return rejectionComment;
    }
}