package com.genbridge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateReportRequest {

    @NotBlank(message = "Description is required")
    private String description;
}
