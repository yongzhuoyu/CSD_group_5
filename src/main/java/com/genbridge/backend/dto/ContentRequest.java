package com.genbridge.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ContentRequest {

    @NotNull(message = "Lesson ID is required")
    private Long lessonId;

    @NotBlank(message = "Term is required")
    private String term;

    @NotBlank(message = "Description is required")
    private String description;

    private String example;

    private String source;

    @Min(value = 1, message = "Order index must be at least 1")
    private int orderIndex;
}
