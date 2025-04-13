package com.vactrack.dto;

import java.util.List;

public class ApiResponse {
    private boolean success;
    private String message;
    private List<String> errors;

    // Constructors
    public ApiResponse() {}

    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ApiResponse(boolean success, String message, List<String> errors) {
        this.success = success;
        this.message = message;
        this.errors = errors;
    }

    // Getters và Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}
