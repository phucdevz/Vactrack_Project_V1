package main.java.com.controller;

import main.java.com.dto.UserDTO;
import main.java.com.model.Appointment;
import main.java.com.model.User;
import main.java.com.service.*;
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
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final ChildService childService;
    private final VaccineService vaccineService;
    private final AppointmentService appointmentService;
    private final PaymentService paymentService;

    @Autowired
    public AdminController(
            UserService userService,
            ChildService childService,
            VaccineService vaccineService,
            AppointmentService appointmentService,
            PaymentService paymentService) {
        this.userService = userService;
        this.childService = childService;
        this.vaccineService = vaccineService;
        this.appointmentService = appointmentService;
        this.paymentService = paymentService;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        // Thống kê tổng quan
        long totalUsers = userService.getAllUsers().size();
        long totalChildren = childService.getAllChildren().size();
        long totalAppointments = appointmentService.getAppointmentsByStatus(Appointment.Status.CONFIRMED).size();

        model.addAttribute("totalUsers", totalUsers);
        model.addAttribute("totalChildren", totalChildren);
        model.addAttribute("totalAppointments", totalAppointments);

        // Danh sách lịch hẹn hôm nay
        List<Appointment> todayAppointments = appointmentService.getAppointmentsByDate(LocalDate.now());
        model.addAttribute("todayAppointments", todayAppointments);

        return "admin/dashboard";
    }

    @GetMapping("/users")
    public String listUsers(Model model) {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());

        model.addAttribute("users", userDTOs);
        return "admin/users/list";
    }

    @GetMapping("/users/{id}")
    public String viewUser(@PathVariable("id") Long id, Model model) {
        try {
            User user = userService.getUserById(id);
            model.addAttribute("user", new UserDTO(user));
            return "admin/users/view";
        } catch (Exception e) {
            return "redirect:/admin/users?error=user-not-found";
        }
    }

    @GetMapping("/users/{id}/edit")
    public String showEditUserForm(@PathVariable("id") Long id, Model model) {
        try {
            User user = userService.getUserById(id);
            model.addAttribute("user", new UserDTO(user));
            return "admin/users/edit";
        } catch (Exception e) {
            return "redirect:/admin/users?error=user-not-found";
        }
    }

    @PostMapping("/users/{id}/edit")
    public String updateUser(@PathVariable("id") Long id,
                             @Valid @ModelAttribute("user") UserDTO userDTO,
                             BindingResult result, Model model) {

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            return "admin/users/edit";
        }

        try {
            User user = userDTO.toUser();
            userService.updateUser(id, user);
            return "redirect:/admin/users/" + id + "?updated";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
            return "admin/users/edit";
        }
    }

    @GetMapping("/users/{id}/enable")
    public String enableUser(@PathVariable("id") Long id) {
        try {
            userService.enableUser(id);
            return "redirect:/admin/users/" + id + "?enabled";
        } catch (Exception e) {
            return "redirect:/admin/users?error=enable-failed";
        }
    }

    @GetMapping("/users/{id}/disable")
    public String disableUser(@PathVariable("id") Long id) {
        try {
            userService.disableUser(id);
            return "redirect:/admin/users/" + id + "?disabled";
        } catch (Exception e) {
            return "redirect:/admin/users?error=disable-failed";
        }
    }

    @GetMapping("/vaccines")
    public String listVaccines(Model model) {
        model.addAttribute("vaccines", vaccineService.getAllVaccines());
        return "admin/vaccines/list";
    }

    @GetMapping("/vaccines/add")
    public String showAddVaccineForm(Model model) {
        model.addAttribute("vaccine", new main.java.com.dto.VaccineDTO());
        return "admin/vaccines/add";
    }

    @PostMapping("/vaccines/add")
    public String addVaccine(@Valid @ModelAttribute("vaccine") main.java.com.dto.VaccineDTO vaccineDTO,
                             BindingResult result, Model model) {

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            return "admin/vaccines/add";
        }

        try {
            vaccineService.createVaccine(vaccineDTO.toVaccine());
            return "redirect:/admin/vaccines?created";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
            return "admin/vaccines/add";
        }
    }

    @GetMapping("/vaccines/{id}/edit")
    public String showEditVaccineForm(@PathVariable("id") Long id, Model model) {
        try {
            model.addAttribute("vaccine", new main.java.com.dto.VaccineDTO(vaccineService.getVaccineById(id)));
            return "admin/vaccines/edit";
        } catch (Exception e) {
            return "redirect:/admin/vaccines?error=vaccine-not-found";
        }
    }

    @PostMapping("/vaccines/{id}/edit")
    public String updateVaccine(@PathVariable("id") Long id,
                                @Valid @ModelAttribute("vaccine") main.java.com.dto.VaccineDTO vaccineDTO,
                                BindingResult result, Model model) {

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            return "admin/vaccines/edit";
        }

        try {
            vaccineService.updateVaccine(id, vaccineDTO.toVaccine());
            return "redirect:/admin/vaccines?updated";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
            return "admin/vaccines/edit";
        }
    }

    @GetMapping("/vaccines/{id}/activate")
    public String activateVaccine(@PathVariable("id") Long id) {
        try {
            vaccineService.activateVaccine(id);
            return "redirect:/admin/vaccines?activated";
        } catch (Exception e) {
            return "redirect:/admin/vaccines?error=activate-failed";
        }
    }

    @GetMapping("/vaccines/{id}/deactivate")
    public String deactivateVaccine(@PathVariable("id") Long id) {
        try {
            vaccineService.deactivateVaccine(id);
            return "redirect:/admin/vaccines?deactivated";
        } catch (Exception e) {
            return "redirect:/admin/vaccines?error=deactivate-failed";
        }
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

        model.addAttribute("appointments", appointments);
        model.addAttribute("statuses", Appointment.Status.values());

        return "admin/appointments/list";
    }

    @GetMapping("/appointments/{id}")
    public String viewAppointment(@PathVariable("id") Long id, Model model) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id);
            model.addAttribute("appointment", appointment);
            return "admin/appointments/view";
        } catch (Exception e) {
            return "redirect:/admin/appointments?error=appointment-not-found";
        }
    }

    @GetMapping("/appointments/{id}/confirm")
    public String confirmAppointment(@PathVariable("id") Long id) {
        try {
            appointmentService.updateAppointmentStatus(id, Appointment.Status.CONFIRMED);
            return "redirect:/admin/appointments/" + id + "?confirmed";
        } catch (Exception e) {
            return "redirect:/admin/appointments?error=confirm-failed";
        }
    }

    @GetMapping("/appointments/{id}/complete")
    public String completeAppointment(@PathVariable("id") Long id) {
        try {
            appointmentService.completeAppointment(id);
            return "redirect:/admin/appointments/" + id + "?completed";
        } catch (Exception e) {
            return "redirect:/admin/appointments?error=complete-failed";
        }
    }

    @GetMapping("/appointments/{id}/cancel")
    public String cancelAppointment(@PathVariable("id") Long id) {
        try {
            appointmentService.cancelAppointment(id, "Hủy bởi quản trị viên");
            return "redirect:/admin/appointments/" + id + "?cancelled";
        } catch (Exception e) {
            return "redirect:/admin/appointments?error=cancel-failed";
        }
    }

    @GetMapping("/reports")
    public String showReports(Model model) {
        // Thống kê người dùng
        long totalUsers = userService.getAllUsers().size();
        long totalCustomers = userService.getAllUsers().stream()
                .filter(u -> u.getRole() == User.Role.CUSTOMER)
                .count();

        // Thống kê trẻ em
        long totalChildren = childService.getAllChildren().size();

        // Thống kê lịch hẹn
        long totalAppointments = appointmentService.getAppointmentsByStatus(Appointment.Status.CONFIRMED).size();
        long completedAppointments = appointmentService.getAppointmentsByStatus(Appointment.Status.COMPLETED).size();

        model.addAttribute("totalUsers", totalUsers);
        model.addAttribute("totalCustomers", totalCustomers);
        model.addAttribute("totalChildren", totalChildren);
        model.addAttribute("totalAppointments", totalAppointments);
        model.addAttribute("completedAppointments", completedAppointments);

        return "admin/reports";
    }

    @GetMapping("/settings")
    public String showSettings(Model model) {
        // Hiển thị các cài đặt hệ thống
        return "admin/settings";
    }
}
