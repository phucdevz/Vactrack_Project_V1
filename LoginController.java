package com.example.login.controller;

import com.example.login.model.AppUser;
import com.example.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {

    @Autowired
    private UserService userService;

    // Thêm endpoint GET để tránh lỗi 405
    @GetMapping("/api/login")
    public String loginInfo() {
        return "Sử dụng phương thức POST với JSON {\"username\": \"admin\", \"password\": \"admin123\"}";
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        boolean isValid = userService.validateUser(loginRequest.getUsername(), loginRequest.getPassword());

        Map<String, Object> response = new HashMap<>();
        if (isValid) {
            AppUser user = userService.findByUsername(loginRequest.getUsername());
            response.put("success", true);
            response.put("message", "Đăng nhập thành công");
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("fullName", user.getFullName());
        } else {
            response.put("success", false);
            response.put("message", "Tên đăng nhập hoặc mật khẩu không đúng");
        }

        return ResponseEntity.ok(response);
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
