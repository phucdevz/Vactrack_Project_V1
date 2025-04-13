package com.vactrack.dto;

import lombok.Data;

@Data
public class TestimonialResponse {
    private Long id;
    private String name;
    private String message;
    private Integer rating;
    private String createdAt;
}
