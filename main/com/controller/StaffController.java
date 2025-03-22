package com.controller;

import main.java.com.dto.AppointmentDTO;
import main.java.com.dto.VaccinationRecordDTO;
import main.java.com.model.Appointment;
import main.java.com.model.VaccinationRecord;
import main.java.com.service.AppointmentService;
import main.java.com.service.ChildService;
import main.java.com.service.VaccinationRecordService;
import main.java.com.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/staff")
public class StaffController {

    private final AppointmentService appointmentService;
    private final VaccinationRecordService recordService;
    private final ChildService childService;
    private final VaccineService vaccineService;

    @Autowired
    public StaffController(
            AppointmentService appointmentService,
            VaccinationRecordService recordService,
            ChildService childService,
            VaccineService vaccineService) {
        this.appointmentService = appointmentService;
        this.recordService = recordService;
        this.childService = childService;
        this.vaccineService = vaccineService;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        // Danh sách lịch hẹn hôm nay
        List<Appointment> todayAppointments = appointmentService.getAppointmentsByDate(LocalDate.now());
        List<AppointmentDTO> appointmentDTOs = todayAppointments.stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());

        model.addAttribute("appointments", appointmentDTOs);
        model.addAttribute("today", LocalDate.now());

        return "staff/dashboard";
    }

    @GetMapping("/appointments")
    public String listAppointments(
            @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(name = "status", required = false) Appointment.Status status,
            Model model) {

        List<Appointment> appointments;

        if (date != null) {
            appointments = appointmentService.getAppointmentsByDate(date);
            model.addAttribute("dateFilter", date);
        } else if (status != null) {
            appointments = appointmentService.getAppointmentsByStatus(status);
            model.addAttribute("statusFilter", status);
        } else {
            appointments = appointmentService.getAppointmentsByDate(LocalDate.now());
            model.addAttribute("dateFilter", LocalDate.now());
        }

        List<AppointmentDTO> appointmentDTOs = appointments.stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());

        model.addAttribute("appointments", appointmentDTOs);
        model.addAttribute("statuses", Appointment.Status.values());

        return "staff/appointments/list";
    }

    @GetMapping("/appointments/{id}")
    public String viewAppointment(@PathVariable("id") Long id, Model model) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id);
            model.addAttribute("appointment", new AppointmentDTO(appointment));
            return "staff/appointments/view";
        } catch (Exception e) {
            return "redirect:/staff/appointments?error=appointment-not-found";
        }
    }

    @GetMapping("/appointments/{id}/process")
    public String showProcessForm(@PathVariable("id") Long id, Model model) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id);

            if (appointment.getStatus() != Appointment.Status.CONFIRMED) {
                return "redirect:/staff/appointments/" + id + "?error=not-confirmed";
            }

            model.addAttribute("appointment", new AppointmentDTO(appointment));
            model.addAttribute("record", new VaccinationRecordDTO());
            model.addAttribute("vaccines", vaccineService.getActiveVaccines());

            return "staff/appointments/process";
        } catch (Exception e) {
            return "redirect:/staff/appointments?error=appointment-not-found";
        }
    }

    @PostMapping("/appointments/{id}/process")
    public String processAppointment(
            @PathVariable("id") Long id,
            @Valid @ModelAttribute("record") VaccinationRecordDTO recordDTO,
            BindingResult result, Model model) {

        if (result.hasErrors()) {
            try {
                Appointment appointment = appointmentService.getAppointmentById(id);
                model.addAttribute("appointment", new AppointmentDTO(appointment));
                model.addAttribute("vaccines", vaccineService.getActiveVaccines());
                return "staff/appointments/process";
            } catch (Exception e) {
                return "redirect:/staff/appointments?error=appointment-not-found";
            }
        }

        try {
            // Tạo bản ghi tiêm chủng
            VaccinationRecord record = new VaccinationRecord();
            record.setVaccinationDate(recordDTO.getVaccinationDate());
            record.setDoseNumber(recordDTO.getDoseNumber());
            record.setBatchNumber(recordDTO.getBatchNumber());
            record.setAdministeredBy(recordDTO.getAdministeredBy());
            record.setNotes(recordDTO.getNotes());

            recordService.createVaccinationRecord(record, recordDTO.getChildId(), recordDTO.getVaccineId());

            // Đánh dấu lịch hẹn đã hoàn thành
            appointmentService.completeAppointment(id);

            return "redirect:/staff/appointments/" + id + "?processed";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());

            try {
                Appointment appointment = appointmentService.getAppointmentById(id);
                model.addAttribute("appointment", new AppointmentDTO(appointment));
                model.addAttribute("vaccines", vaccineService.getActiveVaccines());
                return "staff/appointments/process";
            } catch (Exception ex) {
                return "redirect:/staff/appointments?error=appointment-not-found";
            }
        }
    }

    @GetMapping("/appointments/{id}/confirm")
    public String confirmAppointment(@PathVariable("id") Long id) {
        try {
            appointmentService.updateAppointmentStatus(id, Appointment.Status.CONFIRMED);
            return "redirect:/staff/appointments/" + id + "?confirmed";
        } catch (Exception e) {
            return "redirect:/staff/appointments?error=confirm-failed";
        }
    }

    @GetMapping("/appointments/{id}/cancel")
    public String showCancelForm(@PathVariable("id") Long id, Model model) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id);
            model.addAttribute("appointment", new AppointmentDTO(appointment));
            return "staff/appointments/cancel";
        } catch (Exception e) {
            return "redirect:/staff/appointments?error=appointment-not-found";
        }
    }

    @PostMapping("/appointments/{id}/cancel")
    public String cancelAppointment(
            @PathVariable("id") Long id,
            @RequestParam("reason") String reason) {

        try {
            appointmentService.cancelAppointment(id, reason);
            return "redirect:/staff/appointments/" + id + "?cancelled";
        } catch (Exception e) {
            return "redirect:/staff/appointments?error=cancel-failed";
        }
    }

    @GetMapping("/records")
    public String listRecentRecords(Model model) {
        // Giả sử có một phương thức để lấy các bản ghi gần đây
        // List<VaccinationRecord> recentRecords = recordService.getRecentRecords();

        // Tạm thời hiển thị trang trống
        return "staff/records/list";
    }

    @GetMapping("/children")
    public String listChildren(Model model) {
        model.addAttribute("children", childService.getAllChildren());
        return "staff/children/list";
    }

    @GetMapping("/children/{id}")
    public String viewChild(@PathVariable("id") Long id, Model model) {
        try {
            model.addAttribute("child", childService.getChildById(id));

            // Lấy danh sách bản ghi tiêm chủng
            List<VaccinationRecord> records = recordService.getVaccinationRecordsByChildId(id);
            List<VaccinationRecordDTO> recordDTOs = records.stream()
                    .map(VaccinationRecordDTO::new)
                    .collect(Collectors.toList());

            model.addAttribute("records", recordDTOs);

            return "staff/children/view";
        } catch (Exception e) {
            return "redirect:/staff/children?error=child-not-found";
        }
    }

    @GetMapping("/vaccines")
    public String listVaccines(Model model) {
        model.addAttribute("vaccines", vaccineService.getActiveVaccines());
        return "staff/vaccines/list";
    }
}
