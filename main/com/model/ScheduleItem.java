package com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "schedule_items")
public class ScheduleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private VaccinationSchedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vaccine_id")
    private Vaccine vaccine;

    @Column(name = "recommended_date")
    private LocalDate recommendedDate;

    @Column(name = "dose_number")
    private Integer doseNumber;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String notes;

    public enum Status {
        PENDING, SCHEDULED, COMPLETED, MISSED, SKIPPED
    }
}
