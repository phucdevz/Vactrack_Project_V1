package com.repository;

import main.java.com.model.Appointment;
import main.java.com.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByAppointment(Appointment appointment);
    Optional<Payment> findByAppointmentId(Long appointmentId);
    List<Payment> findByStatus(Payment.Status status);
    List<Payment> findByPaymentDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT p FROM Payment p WHERE p.appointment.child.parent.id = :userId")
    List<Payment> findByUserId(Long userId);
}