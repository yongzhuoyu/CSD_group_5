package com.genbridge.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class RejectRequest {

    @NotBlank
    private String reason;

    private String comment;

    public String getReason() {
        return reason;
    }

    public String getComment() {
        return comment;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}