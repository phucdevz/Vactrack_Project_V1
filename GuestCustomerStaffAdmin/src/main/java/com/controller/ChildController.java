package main.java.com.controller;

import main.java.com.dto.ChildDTO;
import main.java.com.model.Child;
import main.java.com.model.User;
import main.java.com.service.ChildService;
import main.java.com.service.UserService;
import main.java.com.service.VaccinationScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/children")
public class ChildController {

    private final ChildService childService;
    private final UserService userService;
    private final VaccinationScheduleService scheduleService;

    @Autowired
    public ChildController(ChildService childService, UserService userService,
                           VaccinationScheduleService scheduleService) {
        this.childService = childService;
        this.userService = userService;
        this.scheduleService = scheduleService;
    }

    @GetMapping
    public String listChildren(Model model) {
        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        // Lấy danh sách trẻ em của người dùng
        List<Child> children = childService.getChildrenByParentId(user.getId());
        List<ChildDTO> childDTOs = children.stream()
                .map(ChildDTO::new)
                .collect(Collectors.toList());

        model.addAttribute("children", childDTOs);
        return "children/list";
    }

    @GetMapping("/add")
    public String showAddChildForm(Model model) {
        model.addAttribute("child", new ChildDTO());
        return "children/add";
    }

    @PostMapping("/add")
    public String addChild(@Valid @ModelAttribute("child") ChildDTO childDTO,
                           BindingResult result, Model model) {

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            return "children/add";
        }

        try {
            // Lấy thông tin người dùng hiện tại
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            // Tạo hồ sơ trẻ em
            Child child = childDTO.toChild();
            child = childService.createChild(child, user.getId());

            // Tạo lịch tiêm chủng tiêu chuẩn cho trẻ
            scheduleService.createStandardSchedule(child.getId());

            return "redirect:/children?success";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
            return "children/add";
        }
    }

    @GetMapping("/{id}")
    public String viewChild(@PathVariable("id") Long id, Model model) {
        try {
            // Lấy thông tin trẻ em
            Child child = childService.getChildById(id);
            model.addAttribute("child", new ChildDTO(child));

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!child.getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/children?error=unauthorized";
            }

            return "children/view";
        } catch (Exception e) {
            return "redirect:/children?error=not-found";
        }
    }

    @GetMapping("/{id}/edit")
    public String showEditChildForm(@PathVariable("id") Long id, Model model) {
        try {
            // Lấy thông tin trẻ em
            Child child = childService.getChildById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!child.getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/children?error=unauthorized";
            }

            model.addAttribute("child", new ChildDTO(child));
            return "children/edit";
        } catch (Exception e) {
            return "redirect:/children?error=not-found";
        }
    }

    @PostMapping("/{id}/edit")
    public String updateChild(@PathVariable("id") Long id,
                              @Valid @ModelAttribute("child") ChildDTO childDTO,
                              BindingResult result, Model model) {

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            return "children/edit";
        }

        try {
            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());
            Child existingChild = childService.getChildById(id);

            if (!existingChild.getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/children?error=unauthorized";
            }

            // Cập nhật thông tin trẻ em
            Child child = childDTO.toChild();
            child.setId(id);
            childService.updateChild(id, child);

            return "redirect:/children/" + id + "?success";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
            return "children/edit";
        }
    }

    @GetMapping("/{id}/delete")
    public String showDeleteConfirmation(@PathVariable("id") Long id, Model model) {
        try {
            // Lấy thông tin trẻ em
            Child child = childService.getChildById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!child.getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN)) {
                return "redirect:/children?error=unauthorized";
            }

            model.addAttribute("child", new ChildDTO(child));
            return "children/delete";
        } catch (Exception e) {
            return "redirect:/children?error=not-found";
        }
    }

    @PostMapping("/{id}/delete")
    public String deleteChild(@PathVariable("id") Long id) {
        try {
            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());
            Child child = childService.getChildById(id);

            if (!child.getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN)) {
                return "redirect:/children?error=unauthorized";
            }

            // Xóa hồ sơ trẻ em
            childService.deleteChild(id);

            return "redirect:/children?deleted";
        } catch (Exception e) {
            return "redirect:/children?error=delete-failed";
        }
    }
}
