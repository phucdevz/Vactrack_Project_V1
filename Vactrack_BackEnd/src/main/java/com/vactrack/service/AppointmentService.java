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
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;  // Thêm import này
import java.util.Optional;
import java.util.HashMap;

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

    public Optional<Appointment> findById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment createAppointment(Map<String, Object> appointmentData) {
        Appointment appointment = new Appointment();

        // Sử dụng type casting và kiểm tra null
        if (appointmentData.get("patientName") != null) {
            appointment.setPatientName((String) appointmentData.get("patientName"));
        }

        if (appointmentData.get("service") != null) {
            appointment.setService((String) appointmentData.get("service"));
        }

        // Xử lý ngày
        if (appointmentData.get("date") != null) {
            String dateStr = (String) appointmentData.get("date");
            LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            appointment.setAppointmentDate(date);
        }

        // Xử lý thời gian
        if (appointmentData.get("time") != null) {
            String timeStr = (String) appointmentData.get("time");
            LocalTime time = LocalTime.parse(timeStr, DateTimeFormatter.ofPattern("HH:mm"));
            appointment.setAppointmentTime(time);
        }

        // Xử lý trạng thái
        String status = "pending"; // Giá trị mặc định
        if (appointmentData.get("status") != null) {
            status = (String) appointmentData.get("status");
        }
        appointment.setStatus(status);

        // Xử lý số điện thoại và ghi chú
        if (appointmentData.get("phone") != null) {
            appointment.setPhone((String) appointmentData.get("phone"));
        }

        if (appointmentData.get("notes") != null) {
            appointment.setNotes((String) appointmentData.get("notes"));
        }

        return appointmentRepository.save(appointment);
    }

    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn với ID: " + id));

        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public String formatDate(LocalDate date) {
        if (date == null) return null;
        return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }
}
