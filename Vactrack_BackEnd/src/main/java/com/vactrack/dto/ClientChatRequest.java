package com.vactrack.dto;

public class ClientChatRequest {
    private String message;

    public ClientChatRequest() {}

    public ClientChatRequest(String message) {
        this.message = message;
    }

    // Getters và Setters
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}
