package com.vactrack.service;

import com.vactrack.model.Appointment;
import com.vactrack.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public int countTotal() {
        return (int) appointmentRepository.count();
    }

    public int countByStatus(String status) {
        return (int) appointmentRepository.countByStatus(status);
    }

    public List<Appointment> getRecentAppointments(int limit) {
        return appointmentRepository.findTop5ByOrderByAppointmentDateDescAppointmentTimeDesc();
    }

    public Page<Appointment> findAppointments(int page, int size, String status,
                                              String search, LocalDate fromDate, LocalDate toDate) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending()
                .and(Sort.by("appointmentTime").descending()));

        return appointmentRepository.findWithFilters(status, search, fromDate, toDate, pageable);
    }

    public String formatDate(LocalDate date) {
        if (date == null) return null;
        return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }
}
