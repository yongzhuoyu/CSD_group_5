package com.genbridge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestCompletionRequest {

    @NotBlank(message = "Reflection is required")
    private String reflection;
}
