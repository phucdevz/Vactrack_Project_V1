package com.repository;

import com.model.Appointment;
import com.model.Child;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByChild(Child child);
    List<Appointment> findByChildId(Long childId);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByAppointmentDateBetween(LocalDate startDate, LocalDate endDate);
    List<Appointment> findByStatus(Appointment.Status status);

    @Query("SELECT a FROM Appointment a WHERE a.child.parent.id = :userId")
    List<Appointment> findByParentId(Long userId);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date AND a.status = :status")
    List<Appointment> findByDateAndStatus(LocalDate date, Appointment.Status status);
}