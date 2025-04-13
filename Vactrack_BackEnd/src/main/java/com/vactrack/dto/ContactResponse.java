package com.vactrack.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ContactResponse {
    private Long id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private String phone;
    private String status;
    private String createdAt;
}
