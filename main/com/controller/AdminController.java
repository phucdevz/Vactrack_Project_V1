package com.controller;

import com.dto.UserDTO;
import com.dto.VaccineDTO;
import com.model.Appointment;
import com.model.User;
import com.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
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
        try {
            model.addAttribute("totalUsers", userService.countAllUsers());
            model.addAttribute("totalAppointments", appointmentService.countTodayAppointments());
            model.addAttribute("pendingPayments", paymentService.countPendingPayments());
            return "admin/dashboard";
        } catch (Exception e) {
            log.error("Error loading dashboard", e);
            return "error/500";
        }
    }

    @GetMapping("/users")
    public String listUsers(Model model) {
        try {
            List<User> users = userService.getAllUsers();
            model.addAttribute("users", users);
            return "admin/users/list";
        } catch (Exception e) {
            log.error("Error listing users", e);
            return "error/500";
        }
    }

    @GetMapping("/users/{id}")
    public String viewUser(@PathVariable("id") Long id, Model model) {
        try {
            User user = userService.getUserById(id);
            model.addAttribute("user", user);
            return "admin/users/view";
        } catch (Exception e) {
            log.error("Error viewing user: " + id, e);
            return "error/404";
        }
    }

    @GetMapping("/users/{id}/edit")
    public String showEditUserForm(@PathVariable("id") Long id, Model model) {
        try {
            User user = userService.getUserById(id);
            model.addAttribute("user", new UserDTO(user));
            return "admin/users/edit";
        } catch (Exception e) {
            log.error("Error showing edit form for user: " + id, e);
            return "error/404";
        }
    }

    @PostMapping("/users/{id}/edit")
    public String updateUser(@PathVariable("id") Long id,
                             @Valid @ModelAttribute("user") UserDTO userDTO,
                             BindingResult result,
                             Model model) {
        if (result.hasErrors()) {
            return "admin/users/edit";
        }

        try {
            userService.updateUser(id, userDTO);
            return "redirect:/admin/users/" + id + "?updated";
        } catch (Exception e) {
            log.error("Error updating user: " + id, e);
            model.addAttribute("error", "Failed to update user");
            return "admin/users/edit";
        }
    }

    @GetMapping("/users/{id}/enable")
    public String enableUser(@PathVariable("id") Long id) {
        try {
            userService.enableUser(id);
            return "redirect:/admin/users?enabled";
        } catch (Exception e) {
            log.error("Error enabling user: " + id, e);
            return "redirect:/admin/users?error";
        }
    }

    @GetMapping("/users/{id}/disable")
    public String disableUser(@PathVariable("id") Long id) {
        try {
            userService.disableUser(id);
            return "redirect:/admin/users?disabled";
        } catch (Exception e) {
            log.error("Error disabling user: " + id, e);
            return "redirect:/admin/users?error";
        }
    }

    // Vaccines Management
    @GetMapping("/vaccines")
    public String listVaccines(Model model) {
        try {
            model.addAttribute("vaccines", vaccineService.getAllVaccines());
            return "admin/vaccines/list";
        } catch (Exception e) {
            log.error("Error listing vaccines", e);
            return "error/500";
        }
    }

    @GetMapping("/vaccines/add")
    public String showAddVaccineForm(Model model) {
        model.addAttribute("vaccine", new VaccineDTO());
        return "admin/vaccines/add";
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/vaccines/add")
    public String addVaccine(@Valid @ModelAttribute("vaccine") VaccineDTO vaccineDTO,
                             BindingResult result,
                             Model model) {
        if (result.hasErrors()) {
            return "admin/vaccines/add";
        }

        try {
            vaccineService.addVaccine(vaccineDTO);
            return "redirect:/admin/vaccines?created";
        } catch (Exception e) {
            log.error("Error adding vaccine", e);
            model.addAttribute("error", "Failed to add vaccine");
            return "admin/vaccines/add";
        }
    }

    // Additional methods...

    @GetMapping("/appointments")
    public String listAppointments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Appointment.Status status,
            Model model) {
        try {
            List<Appointment> appointments;
            if (date != null) {
                appointments = appointmentService.getAppointmentsByDate(date);
            } else if (status != null) {
                appointments = appointmentService.getAppointmentsByStatus(status);
            } else {
                appointments = appointmentService.getAllAppointments();
            }

            model.addAttribute("appointments", appointments);
            model.addAttribute("statuses", Appointment.Status.values());
            return "admin/appointments/list";
        } catch (Exception e) {
            log.error("Error listing appointments", e);
            return "error/500";
        }
    }
}