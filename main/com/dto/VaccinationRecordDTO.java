package com.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import main.java.com.model.VaccinationRecord;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationRecordDTO {

    private Long id;

    @NotNull(message = "Child ID is required")
    private Long childId;

    private String childName;

    @NotNull(message = "Vaccine ID is required")
    private Long vaccineId;

    private String vaccineName;

    @NotNull(message = "Vaccination date is required")
    @PastOrPresent(message = "Vaccination date must be today or in the past")
    private LocalDate vaccinationDate;

    @NotNull(message = "Dose number is required")
    @Positive(message = "Dose number must be positive")
    private Integer doseNumber;

    private String batchNumber;

    private String administeredBy;

    private LocalDate nextDoseDate;

    private String notes;

    // Constructor để chuyển đổi từ VaccinationRecord sang VaccinationRecordDTO
    public VaccinationRecordDTO(VaccinationRecord record) {
        this.id = record.getId();
        if (record.getChild() != null) {
            this.childId = record.getChild().getId();
            this.childName = record.getChild().getName();
        }
        if (record.getVaccine() != null) {
            this.vaccineId = record.getVaccine().getId();
            this.vaccineName = record.getVaccine().getName();
        }
        this.vaccinationDate = record.getVaccinationDate();
        this.doseNumber = record.getDoseNumber();
        this.batchNumber = record.getBatchNumber();
        this.administeredBy = record.getAdministeredBy();
        this.nextDoseDate = record.getNextDoseDate();
        this.notes = record.getNotes();
    }
}
