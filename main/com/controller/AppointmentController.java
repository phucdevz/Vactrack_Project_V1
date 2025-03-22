package com.controller;

import com.dto.AppointmentDTO;
import com.model.Appointment;
import com.model.Child;
import com.model.User;
import com.service.AppointmentService;
import com.service.ChildService;
import com.service.UserService;
import com.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final ChildService childService;
    private final UserService userService;
    private final VaccineService vaccineService;

    @Autowired
    public AppointmentController(
            AppointmentService appointmentService,
            ChildService childService,
            UserService userService,
            VaccineService vaccineService) {
        this.appointmentService = appointmentService;
        this.childService = childService;
        this.userService = userService;
        this.vaccineService = vaccineService;
    }

    @GetMapping
    public String listAppointments(Model model) {
        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        // Lấy danh sách lịch hẹn của người dùng
        List<Appointment> appointments = appointmentService.getAppointmentsByParentId(user.getId());
        List<AppointmentDTO> appointmentDTOs = appointments.stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());

        model.addAttribute("appointments", appointmentDTOs);
        return "appointments/list";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        // Lấy danh sách trẻ em của người dùng
        List<Child> children = childService.getChildrenByParentId(user.getId());

        model.addAttribute("appointment", new AppointmentDTO());
        model.addAttribute("children", children);
        model.addAttribute("vaccines", vaccineService.getActiveVaccines());

        return "appointments/create";
    }

    @PostMapping("/create")
    public String createAppointment(@Valid @ModelAttribute("appointment") AppointmentDTO appointmentDTO,
                                    BindingResult result, Model model) {

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            // Lấy thông tin người dùng hiện tại
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            // Lấy danh sách trẻ em của người dùng
            List<Child> children = childService.getChildrenByParentId(user.getId());

            model.addAttribute("children", children);
            model.addAttribute("vaccines", vaccineService.getActiveVaccines());
            return "appointments/create";
        }

        try {
            // Tạo đối tượng Appointment từ DTO
            Appointment appointment = new Appointment();
            appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
            appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
            appointment.setNotes(appointmentDTO.getNotes());

            // Tạo lịch hẹn
            appointmentService.createAppointment(appointment, appointmentDTO.getChildId(), appointmentDTO.getVaccineIds());

            return "redirect:/appointments?created";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());

            // Lấy thông tin người dùng hiện tại
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            // Lấy danh sách trẻ em của người dùng
            List<Child> children = childService.getChildrenByParentId(user.getId());

            model.addAttribute("children", children);
            model.addAttribute("vaccines", vaccineService.getActiveVaccines());

            return "appointments/create";
        }
    }

    @GetMapping("/{id}")
    public String viewAppointment(@PathVariable("id") Long id, Model model) {
        try {
            // Lấy thông tin lịch hẹn
            Appointment appointment = appointmentService.getAppointmentById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!appointment.getChild().getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/appointments?error=unauthorized";
            }

            model.addAttribute("appointment", new AppointmentDTO(appointment));
            return "appointments/view";
        } catch (Exception e) {
            return "redirect:/appointments?error=not-found";
        }
    }

    @GetMapping("/{id}/cancel")
    public String showCancelForm(@PathVariable("id") Long id, Model model) {
        try {
            // Lấy thông tin lịch hẹn
            Appointment appointment = appointmentService.getAppointmentById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!appointment.getChild().getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/appointments?error=unauthorized";
            }

            // Kiểm tra xem lịch hẹn có thể hủy không
            if (appointment.getStatus() == Appointment.Status.COMPLETED) {
                return "redirect:/appointments?error=cannot-cancel-completed";
            }

            model.addAttribute("appointment", new AppointmentDTO(appointment));
            return "appointments/cancel";
        } catch (Exception e) {
            return "redirect:/appointments?error=not-found";
        }
    }

    @PostMapping("/{id}/cancel")
    public String cancelAppointment(@PathVariable("id") Long id,
                                    @RequestParam("reason") String reason) {
        try {
            // Lấy thông tin lịch hẹn
            Appointment appointment = appointmentService.getAppointmentById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!appointment.getChild().getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/appointments?error=unauthorized";
            }

            // Hủy lịch hẹn
            appointmentService.cancelAppointment(id, reason);

            return "redirect:/appointments?cancelled";
        } catch (IllegalStateException e) {
            return "redirect:/appointments?error=cannot-cancel";
        } catch (Exception e) {
            return "redirect:/appointments?error=cancel-failed";
        }
    }

    @GetMapping("/calendar")
    public String showCalendar(
            @RequestParam(name = "month", required = false) Integer month,
            @RequestParam(name = "year", required = false) Integer year,
            Model model) {

        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        // Xác định tháng và năm hiển thị
        LocalDate today = LocalDate.now();
        if (month == null) month = today.getMonthValue();
        if (year == null) year = today.getYear();

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        // Lấy danh sách lịch hẹn trong tháng
        List<Appointment> appointments = appointmentService.getAppointmentsBetweenDates(startDate, endDate);

        model.addAttribute("month", month);
        model.addAttribute("year", year);
        model.addAttribute("appointments", appointments);

        return "appointments/calendar";
    }

    // Các phương thức khác như cập nhật lịch hẹn, đánh dấu hoàn thành, v.v.
}
