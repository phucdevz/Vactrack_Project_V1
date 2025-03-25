package com.vactrack.controller;

import com.vactrack.model.Appointment;
import com.vactrack.service.AppointmentService;
import com.vactrack.service.VaccinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AppointmentService appointmentService;
    private final VaccinationService vaccinationService;

    @Autowired
    public AdminController(AppointmentService appointmentService, VaccinationService vaccinationService) {
        this.appointmentService = appointmentService;
        this.vaccinationService = vaccinationService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> response = new HashMap<>();

        // Thống kê
        Map<String, Integer> stats = new HashMap<>();
        stats.put("totalAppointments", appointmentService.countTotal());
        stats.put("completedAppointments", appointmentService.countByStatus("completed"));
        stats.put("canceledAppointments", appointmentService.countByStatus("canceled"));
        stats.put("pendingAppointments", appointmentService.countByStatus("pending"));

        // Các cuộc hẹn gần đây
        List<Map<String, Object>> recentAppointments = appointmentService.getRecentAppointments(5)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        response.put("stats", stats);
        response.put("recentAppointments", recentAppointments);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointments")
    public ResponseEntity<Map<String, Object>> getAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate toDate) {

        Page<Appointment> appointmentPage = appointmentService.findAppointments(
                page, size, status, search, fromDate, toDate);

        Map<String, Object> response = new HashMap<>();

        List<Map<String, Object>> content = appointmentPage.getContent().stream()
                .map(this::convertToDetailedDto)
                .collect(Collectors.toList());

        response.put("content", content);
        response.put("totalElements", appointmentPage.getTotalElements());
        response.put("totalPages", appointmentPage.getTotalPages());
        response.put("currentPage", appointmentPage.getNumber());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/statistics/vaccinations")
    public ResponseEntity<Map<String, Object>> getVaccinationStatistics(
            @RequestParam(defaultValue = "month") String period) {

        Map<String, Object> response = new HashMap<>();

        // Dữ liệu theo tháng
        List<Map<String, Object>> monthlyData = vaccinationService.getMonthlyData();
        response.put("monthlyData", monthlyData);

        // Phân phối theo dịch vụ
        List<Map<String, Object>> distributionByService = vaccinationService.getDistributionByService();
        response.put("distributionByService", distributionByService);

        // Dữ liệu xu hướng
        List<Map<String, Object>> trendData = vaccinationService.getTrendData(period);
        response.put("trendData", trendData);

        return ResponseEntity.ok(response);
    }


    private Map<String, Object> convertToDto(Appointment appointment) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", appointment.getId().toString());
        dto.put("patientName", appointment.getPatientName());
        dto.put("date", formatDate(appointment.getAppointmentDate()));
        dto.put("time", formatTime(appointment.getAppointmentTime()));
        dto.put("service", appointment.getService());
        dto.put("status", appointment.getStatus());
        return dto;
    }

    private Map<String, Object> convertToDetailedDto(Appointment appointment) {
        Map<String, Object> dto = convertToDto(appointment);
        dto.put("notes", appointment.getNotes());
        return dto;
    }

    private String formatDate(LocalDate date) {
        if (date == null) return null;
        return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    private String formatTime(LocalTime time) {
        if (time == null) return null;
        return time.format(DateTimeFormatter.ofPattern("HH:mm"));
    }
}
