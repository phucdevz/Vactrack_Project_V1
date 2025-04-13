package com.vactrack.dto;

public class ChildResponse {
    private Long id;
    private String name;
    private String dob;
    private String gender;
    private String bloodType;
    private String allergies;
    private String notes;

    // Constructors
    public ChildResponse() {}

    public ChildResponse(Long id, String name, String dob, String gender,
                         String bloodType, String allergies, String notes) {
        this.id = id;
        this.name = name;
        this.dob = dob;
        this.gender = gender;
        this.bloodType = bloodType;
        this.allergies = allergies;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
