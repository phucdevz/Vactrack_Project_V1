package main.java.com.controller;

import main.java.com.dto.UserRegistrationDTO;
import main.java.com.model.User;
import main.java.com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new UserRegistrationDTO());
        return "auth/register";
    }

    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute("user") UserRegistrationDTO registrationDTO,
                               BindingResult result, Model model) {

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            return "auth/register";
        }

        // Kiểm tra mật khẩu xác nhận
        if (!registrationDTO.getPassword().equals(registrationDTO.getConfirmPassword())) {
            result.rejectValue("confirmPassword", "error.user", "Mật khẩu xác nhận không khớp");
            return "auth/register";
        }

        // Kiểm tra username đã tồn tại
        if (userService.isUsernameExists(registrationDTO.getUsername())) {
            result.rejectValue("username", "error.user", "Tên đăng nhập đã tồn tại");
            return "auth/register";
        }

        // Kiểm tra email đã tồn tại
        if (userService.isEmailExists(registrationDTO.getEmail())) {
            result.rejectValue("email", "error.user", "Email đã tồn tại");
            return "auth/register";
        }

        // Tạo đối tượng User từ DTO
        User user = new User();
        user.setUsername(registrationDTO.getUsername());
        user.setPassword(registrationDTO.getPassword()); // Password sẽ được mã hóa trong service
        user.setEmail(registrationDTO.getEmail());
        user.setPhone(registrationDTO.getPhone());
        user.setFullName(registrationDTO.getFullName());
        user.setRole(User.Role.CUSTOMER);

        // Đăng ký người dùng
        try {
            userService.registerUser(user);
            return "redirect:/auth/login?registered";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi trong quá trình đăng ký: " + e.getMessage());
            return "auth/register";
        }
    }

    @GetMapping("/forgot-password")
    public String forgotPassword() {
        return "auth/forgot-password";
    }

    @PostMapping("/forgot-password")
    public String processForgotPassword(String email, Model model) {
        // Xử lý quên mật khẩu
        // Gửi email với link reset password

        model.addAttribute("message", "Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email của bạn");
        return "auth/forgot-password";
    }
}
