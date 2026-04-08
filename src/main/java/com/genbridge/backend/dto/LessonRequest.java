package com.genbridge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LessonRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    private String objective;
}
