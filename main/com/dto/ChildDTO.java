package com.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.model.Child;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChildDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Birth date is required")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @NotNull(message = "Gender is required")
    private Child.Gender gender;

    private String medicalHistory;

    private String allergies;

    private Long parentId;

    // Constructor để chuyển đổi từ Child sang ChildDTO
    public ChildDTO(Child child) {
        this.id = child.getId();
        this.name = child.getName();
        this.birthDate = child.getBirthDate();
        this.gender = child.getGender();
        this.medicalHistory = child.getMedicalHistory();
        this.allergies = child.getAllergies();
        if (child.getParent() != null) {
            this.parentId = child.getParent().getId();
        }
    }

    // Phương thức để chuyển đổi từ ChildDTO sang Child
    public Child toChild() {
        Child child = new Child();
        child.setId(this.id);
        child.setName(this.name);
        child.setBirthDate(this.birthDate);
        child.setGender(this.gender);
        child.setMedicalHistory(this.medicalHistory);
        child.setAllergies(this.allergies);
        return child;
    }
}
