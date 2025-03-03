package main.java.com.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import main.java.com.model.Appointment;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {

    private Long id;

    @NotNull(message = "Child ID is required")
    private Long childId;

    private String childName;

    @NotNull(message = "Appointment date is required")
    @FutureOrPresent(message = "Appointment date must be today or in the future")
    private LocalDate appointmentDate;

    @NotNull(message = "Appointment time is required")
    private LocalTime appointmentTime;

    private Appointment.AppointmentType type;

    private Appointment.Status status;

    private String notes;

    @NotNull(message = "At least one vaccine must be selected")
    private List<Long> vaccineIds;

    private List<String> vaccineNames;

    // Constructor để chuyển đổi từ Appointment sang AppointmentDTO
    public AppointmentDTO(Appointment appointment) {
        this.id = appointment.getId();
        if (appointment.getChild() != null) {
            this.childId = appointment.getChild().getId();
            this.childName = appointment.getChild().getName();
        }
        this.appointmentDate = appointment.getAppointmentDate();
        this.appointmentTime = appointment.getAppointmentTime();
        this.type = appointment.getType();
        this.status = appointment.getStatus();
        this.notes = appointment.getNotes();

        // Các trường vaccineIds và vaccineNames sẽ được điền sau khi lấy dữ liệu từ DB
    }
}
