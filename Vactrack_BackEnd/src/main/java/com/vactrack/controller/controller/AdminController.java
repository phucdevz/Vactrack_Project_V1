package com.vactrack.controller;

import com.vactrack.model.Appointment;
import com.vactrack.service.AppointmentService;
import com.vactrack.service.VaccinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
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

    // Dashboard endpoint
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

    // Appointments list with filtering and pagination
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

    // Get appointment details by ID
    @GetMapping("/appointments/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        return appointmentService.findById(id)
                .map(appointment -> ResponseEntity.ok(convertToDetailedDto(appointment)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new appointment
    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointment(@RequestBody Map<String, Object> appointmentData) {
        try {
            Appointment newAppointment = appointmentService.createAppointment(appointmentData);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDetailedDto(newAppointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Update appointment status
    @PutMapping("/appointments/{id}")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        if (newStatus == null || !Arrays.asList("completed", "pending", "canceled").contains(newStatus)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Trạng thái không hợp lệ"));
        }

        try {
            Appointment updatedAppointment = appointmentService.updateStatus(id, newStatus);
            return ResponseEntity.ok(convertToDetailedDto(updatedAppointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Vaccination statistics
    @GetMapping("/statistics/vaccinations")
    public ResponseEntity<?> getVaccinationStatistics(
            @RequestParam(defaultValue = "month") String period,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {

        Map<String, Object> statistics = new HashMap<>();

        // Thống kê tổng quan
        long totalVaccinations = appointmentService.countTotal();
        long completedVaccinations = appointmentService.countByStatus("completed");
        long pendingVaccinations = appointmentService.countByStatus("pending");
        long canceledVaccinations = appointmentService.countByStatus("canceled");

        statistics.put("totalVaccinations", totalVaccinations);
        statistics.put("completedVaccinations", completedVaccinations);
        statistics.put("pendingVaccinations", pendingVaccinations);
        statistics.put("canceledVaccinations", canceledVaccinations);

        // Dữ liệu theo thời gian
        List<Map<String, Object>> timeSeriesData = vaccinationService.getMonthlyData();
        statistics.put("timeSeriesData", timeSeriesData);

        // Phân phối theo dịch vụ
        List<Map<String, Object>> vaccineDistribution = vaccinationService.getDistributionByService();
        statistics.put("vaccineDistribution", vaccineDistribution);

        return ResponseEntity.ok(statistics);
    }

    // Revenue statistics
    @GetMapping("/statistics/revenue")
    public ResponseEntity<?> getRevenueStatistics(
            @RequestParam(defaultValue = "month") String period,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {

        Map<String, Object> statistics = new HashMap<>();

        // Giả lập tổng doanh thu
        double totalRevenue = 15000000;
        statistics.put("totalRevenue", totalRevenue);

        // Dữ liệu doanh thu theo thời gian
        List<Map<String, Object>> timeSeriesData = getRevenueTimeSeriesData(period);
        statistics.put("timeSeriesData", timeSeriesData);

        // Phân phối theo gói dịch vụ
        List<Map<String, Object>> packageDistribution = getPackageDistribution();
        statistics.put("packageDistribution", packageDistribution);

        return ResponseEntity.ok(statistics);
    }

    // Helper methods for data conversion

    private Map<String, Object> convertToDto(Appointment appointment) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", appointment.getId().toString());
        dto.put("patientName", appointment.getPatientName());
        dto.put("date", formatDate(appointment.getAppointmentDate()));
        dto.put("time", formatTime(appointment.getAppointmentTime()));
        dto.put("service", appointment.getService());
        dto.put("status", appointment.getStatus());
        dto.put("phone", appointment.getPhone());
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

    // Helper methods for revenue statistics (for demonstration)

    private List<Map<String, Object>> getRevenueTimeSeriesData(String period) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate startDate;
        LocalDate endDate = LocalDate.now();

        if ("day".equals(period)) {
            startDate = endDate.minusDays(30);
        } else if ("week".equals(period)) {
            startDate = endDate.minusWeeks(12);
        } else if ("year".equals(period)) {
            startDate = endDate.minusYears(5);
        } else { // month (default)
            startDate = endDate.minusMonths(12);
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate current = startDate;

        while (!current.isAfter(endDate)) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", current.format(formatter));
            point.put("amount", (int) (Math.random() * 1000000)); // Random revenue data
            result.add(point);

            if ("day".equals(period)) {
                current = current.plusDays(1);
            } else if ("week".equals(period)) {
                current = current.plusWeeks(1);
            } else if ("year".equals(period)) {
                current = current.plusYears(1);
            } else { // month
                current = current.plusMonths(1);
            }
        }

        return result;
    }

    private List<Map<String, Object>> getPackageDistribution() {
        List<Map<String, Object>> result = new ArrayList<>();

        String[] packages = {"Gói cơ bản", "Gói nâng cao", "Gói đầy đủ", "Gói trẻ sơ sinh", "Gói trẻ em"};
        for (String pkg : packages) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", pkg);
            item.put("amount", (int) (Math.random() * 5000000)); // Random revenue data
            result.add(item);
        }

        return result;
    }
}
