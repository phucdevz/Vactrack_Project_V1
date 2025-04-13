package com.vactrack.dto;

public class BookingResponse {
    private String id;
    private String userId;
    private String patientName;
    private String patientDob;
    private String serviceType;
    private String packageType;
    private String appointmentDate;
    private String appointmentTime;
    private String status;
    private String notes;
    private String createdAt;

    // Constructors
    public BookingResponse() {}

    public BookingResponse(String id, String userId, String patientName, String patientDob,
                           String serviceType, String packageType, String appointmentDate,
                           String appointmentTime, String status, String notes, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.patientName = patientName;
        this.patientDob = patientDob;
        this.serviceType = serviceType;
        this.packageType = packageType;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientDob() {
        return patientDob;
    }

    public void setPatientDob(String patientDob) {
        this.patientDob = patientDob;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getPackageType() {
        return packageType;
    }

    public void setPackageType(String packageType) {
        this.packageType = packageType;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
