package com.vactrack.repository;

import com.vactrack.model.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    long countByStatus(String status);

    List<Appointment> findTop5ByOrderByAppointmentDateDescAppointmentTimeDesc();

    @Query("SELECT a FROM Appointment a WHERE " +
            "(:status IS NULL OR a.status = :status) AND " +
            "(:search IS NULL OR a.patientName LIKE %:search%) AND " +
            "(:fromDate IS NULL OR a.appointmentDate >= :fromDate) AND " +
            "(:toDate IS NULL OR a.appointmentDate <= :toDate)")
    Page<Appointment> findWithFilters(
            @Param("status") String status,
            @Param("search") String search,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            Pageable pageable);

    @Query("SELECT FUNCTION('MONTH', a.appointmentDate) as month, COUNT(a) as count " +
            "FROM Appointment a " +
            "WHERE a.appointmentDate >= :startDate " +
            "GROUP BY FUNCTION('MONTH', a.appointmentDate)")
    List<Object[]> countByMonth(@Param("startDate") LocalDate startDate);

    @Query("SELECT a.service as service, COUNT(a) as count " +
            "FROM Appointment a " +
            "GROUP BY a.service")
    List<Object[]> countByService();
}
