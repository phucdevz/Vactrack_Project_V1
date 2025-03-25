package com.vactrack.dto;

import com.vactrack.model.User;

public class AuthResponse {
    private String token;
    private UserDTO user;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = new UserDTO(user);
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public static class UserDTO {
        private String id;
        private String name;
        private String email;
        private String role;
        private String avatar;

        public UserDTO(User user) {
            this.id = user.getId().toString();
            this.name = user.getName();
            this.email = user.getEmail();
            this.role = user.getRole();
            this.avatar = user.getAvatar();
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getAvatar() {
            return avatar;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }
    }
}
