package com.vactrack.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FeedbackPublishRequest {
    @NotNull(message = "Published status is required")
    private Boolean published;
}
