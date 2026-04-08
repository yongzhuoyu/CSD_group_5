package com.genbridge.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateQuizQuestionRequest {

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotEmpty(message = "Options are required")
    @Size(min = 4, max = 4, message = "Exactly 4 options are required")
    private List<@NotBlank(message = "Option cannot be blank") String> options;

    @Min(value = 0, message = "Correct index must be between 0 and 3")
    @Max(value = 3, message = "Correct index must be between 0 and 3")
    private int correctIndex;

    private String explanation;
}
