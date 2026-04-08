package com.genbridge.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class SubmitQuizRequest {

    @NotNull(message = "Answers are required")
    private Map<Long, Integer> answers;
}
