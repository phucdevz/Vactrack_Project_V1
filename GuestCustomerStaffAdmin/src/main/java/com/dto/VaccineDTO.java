package main.java.com.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import main.java.com.model.Vaccine;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VaccineDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    private String recommendedAge;

    @Positive(message = "Doses required must be positive")
    private Integer dosesRequired;

    @Positive(message = "Days between doses must be positive")
    private Integer daysBetweenDoses;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private String manufacturer;

    private String storageTemperature;

    private boolean active;

    // Constructor để chuyển đổi từ Vaccine sang VaccineDTO
    public VaccineDTO(Vaccine vaccine) {
        this.id = vaccine.getId();
        this.name = vaccine.getName();
        this.description = vaccine.getDescription();
        this.recommendedAge = vaccine.getRecommendedAge();
        this.dosesRequired = vaccine.getDosesRequired();
        this.daysBetweenDoses = vaccine.getDaysBetweenDoses();
        this.price = vaccine.getPrice();
        this.manufacturer = vaccine.getManufacturer();
        this.storageTemperature = vaccine.getStorageTemperature();
        this.active = vaccine.isActive();
    }

    // Phương thức để chuyển đổi từ VaccineDTO sang Vaccine
    public Vaccine toVaccine() {
        Vaccine vaccine = new Vaccine();
        vaccine.setId(this.id);
        vaccine.setName(this.name);
        vaccine.setDescription(this.description);
        vaccine.setRecommendedAge(this.recommendedAge);
        vaccine.setDosesRequired(this.dosesRequired);
        vaccine.setDaysBetweenDoses(this.daysBetweenDoses);
        vaccine.setPrice(this.price);
        vaccine.setManufacturer(this.manufacturer);
        vaccine.setStorageTemperature(this.storageTemperature);
        vaccine.setActive(this.active);
        return vaccine;
    }
}
