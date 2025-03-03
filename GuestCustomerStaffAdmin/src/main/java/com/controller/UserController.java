package main.java.com.controller;

import main.java.com.dto.UserDTO;
import main.java.com.model.User;
import main.java.com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public String showProfile(Model model) {
        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        model.addAttribute("user", new UserDTO(user));
        return "user/profile";
    }

    @PostMapping("/profile")
    public String updateProfile(@Valid @ModelAttribute("user") UserDTO userDTO,
                                BindingResult result, Model model) {

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            return "user/profile";
        }

        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.getUserByUsername(auth.getName());

        // Kiểm tra email đã tồn tại (nếu thay đổi email)
        if (!currentUser.getEmail().equals(userDTO.getEmail()) &&
                userService.isEmailExists(userDTO.getEmail())) {
            result.rejectValue("email", "error.user", "Email đã tồn tại");
            return "user/profile";
        }

        try {
            // Cập nhật thông tin người dùng
            userService.updateUser(currentUser.getId(), userDTO.toUser());
            model.addAttribute("success", "Cập nhật thông tin thành công");
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
        }

        return "user/profile";
    }

    @GetMapping("/change-password")
    public String showChangePasswordForm() {
        return "user/change-password";
    }

    @PostMapping("/change-password")
    public String changePassword(@RequestParam("currentPassword") String currentPassword,
                                 @RequestParam("newPassword") String newPassword,
                                 @RequestParam("confirmPassword") String confirmPassword,
                                 Model model) {

        // Kiểm tra mật khẩu mới và xác nhận
        if (!newPassword.equals(confirmPassword)) {
            model.addAttribute("error", "Mật khẩu xác nhận không khớp");
            return "user/change-password";
        }

        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.getUserByUsername(auth.getName());

        try {
            // Cập nhật mật khẩu
            userService.updatePassword(currentUser.getId(), currentPassword, newPassword);
            model.addAttribute("success", "Đổi mật khẩu thành công");
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
        }

        return "user/change-password";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        model.addAttribute("user", new UserDTO(user));
        // Thêm các thông tin khác cho dashboard

        return "user/dashboard";
    }
}
