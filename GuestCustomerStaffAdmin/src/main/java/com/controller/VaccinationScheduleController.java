package main.java.com.controller;

import main.java.com.model.Child;
import main.java.com.model.ScheduleItem;
import main.java.com.model.User;
import main.java.com.model.VaccinationSchedule;
import main.java.com.service.ChildService;
import main.java.com.service.UserService;
import main.java.com.service.VaccinationScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/schedules")
public class VaccinationScheduleController {

    private final VaccinationScheduleService scheduleService;
    private final ChildService childService;
    private final UserService userService;

    @Autowired
    public VaccinationScheduleController(
            VaccinationScheduleService scheduleService,
            ChildService childService,
            UserService userService) {
        this.scheduleService = scheduleService;
        this.childService = childService;
        this.userService = userService;
    }

    @GetMapping("/child/{childId}")
    public String viewSchedule(@PathVariable("childId") Long childId, Model model) {
        try {
            // Lấy thông tin trẻ em
            Child child = childService.getChildById(childId);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!child.getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/children?error=unauthorized";
            }

            // Lấy lịch tiêm chủng
            VaccinationSchedule schedule = scheduleService.getScheduleByChildId(childId);

            model.addAttribute("child", child);
            model.addAttribute("schedule", schedule);
            return "schedules/view";
        } catch (Exception e) {
            return "redirect:/children?error=schedule-not-found";
        }
    }

    @GetMapping("/child/{childId}/create")
    public String createSchedule(@PathVariable("childId") Long childId) {
        try {
            // Lấy thông tin trẻ em
            Child child = childService.getChildById(childId);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!child.getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/children?error=unauthorized";
            }

            // Tạo lịch tiêm chủng tiêu chuẩn
            scheduleService.createStandardSchedule(childId);

            return "redirect:/schedules/child/" + childId + "?created";
        } catch (IllegalArgumentException e) {
            return "redirect:/schedules/child/" + childId + "?error=already-exists";
        } catch (Exception e) {
            return "redirect:/children?error=create-schedule-failed";
        }
    }

    @GetMapping("/item/{itemId}/update")
    public String updateScheduleItemStatus(
            @PathVariable("itemId") Long itemId,
            @RequestParam("status") ScheduleItem.Status status) {

        try {
            // Cập nhật trạng thái mục lịch tiêm
            scheduleService.updateScheduleItemStatus(itemId, status);

            // Giả sử có một phương thức để lấy childId từ itemId
            // Long childId = scheduleService.getChildIdByItemId(itemId);

            // Tạm thời redirect về trang chính
            return "redirect:/children";
        } catch (Exception e) {
            return "redirect:/children?error=update-status-failed";
        }
    }

    @GetMapping("/child/{childId}/customize")
    public String showCustomizeForm(@PathVariable("childId") Long childId, Model model) {
        try {
            // Lấy thông tin trẻ em
            Child child = childService.getChildById(childId);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!child.getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/children?error=unauthorized";
            }

            // Lấy lịch tiêm chủng hiện tại
            VaccinationSchedule schedule = scheduleService.getScheduleByChildId(childId);

            model.addAttribute("child", child);
            model.addAttribute("schedule", schedule);
            // Thêm danh sách vắc-xin để chọn
            // model.addAttribute("vaccines", vaccineService.getActiveVaccines());

            return "schedules/customize";
        } catch (Exception e) {
            return "redirect:/children?error=schedule-not-found";
        }
    }

    // Phương thức POST để xử lý form tùy chỉnh lịch tiêm
    // @PostMapping("/child/{childId}/customize")
    // public String customizeSchedule(...) { ... }
}
