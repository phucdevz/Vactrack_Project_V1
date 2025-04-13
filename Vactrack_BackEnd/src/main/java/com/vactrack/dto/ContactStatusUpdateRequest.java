package com.vactrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ContactStatusUpdateRequest {
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "new|in-progress|completed", message = "Status must be one of: new, in-progress, completed")
    private String status;
}
