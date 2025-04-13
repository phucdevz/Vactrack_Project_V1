package com.vactrack.model;

import jakarta.persistence.*;

@Entity
@Table(name = "social_users")
public class SocialUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String provider; // "google" hoặc "facebook"

    @Column(nullable = false)
    private String providerId; // ID từ provider

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String name;

    private String pictureUrl;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Constructor mặc định
    public SocialUser() {
    }

    // Constructor với tham số
    public SocialUser(String provider, String providerId, String email, String name, String pictureUrl) {
        this.provider = provider;
        this.providerId = providerId;
        this.email = email;
        this.name = name;
        this.pictureUrl = pictureUrl;
    }

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}