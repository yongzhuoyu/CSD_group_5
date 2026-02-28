package com.genbridge.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ContentRequest {

    @NotBlank
    private String title;

    private boolean submit;

    @NotBlank
    private String term;

    @NotBlank
    private String categorySlug;

    @NotBlank
    private String body;

    public String getTitle() {
        return title;
    }

    public String getTerm() {
        return term;
    }

    public String getCategorySlug() {
        return categorySlug;
    }

    public String getBody() {
        return body;
    }

    public boolean isSubmit() {
        return submit;
    }
}