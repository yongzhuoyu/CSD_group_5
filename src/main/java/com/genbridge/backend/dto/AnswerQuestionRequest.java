package com.genbridge.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AnswerQuestionRequest {

    @NotNull(message = "selectedIndex is required")
    @Min(value = 0, message = "selectedIndex must be between 0 and 3")
    @Max(value = 3, message = "selectedIndex must be between 0 and 3")
    private Integer selectedIndex;
}
