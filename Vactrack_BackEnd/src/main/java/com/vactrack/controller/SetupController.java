package com.vactrack.controller;

import com.vactrack.dto.RegisterRequest;
import com.vactrack.model.User;
import com.vactrack.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/setup")
@CrossOrigin(origins = "*")
public class SetupController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SetupController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/first-admin")
    public ResponseEntity<?> createFirstAdmin(@RequestBody RegisterRequest request) {
        // Kiểm tra xem đã có admin nào chưa
        boolean adminExists = userRepository.findByRole("ADMIN").size() > 0;

        if (adminExists) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin đã tồn tại! Không thể tạo admin đầu tiên.");
            return ResponseEntity.badRequest().body(response);
        }

        // Tạo admin đầu tiên
        User admin = new User();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole("ADMIN");
        admin.setAvatar("https://ui-avatars.com/api/?name=" + request.getName().replace(" ", "+") + "&background=random");

        User savedAdmin = userRepository.save(admin);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đã tạo tài khoản admin đầu tiên thành công!");
        response.put("admin", Map.of(
                "id", savedAdmin.getId(),
                "name", savedAdmin.getName(),
                "email", savedAdmin.getEmail(),
                "role", savedAdmin.getRole()
        ));

        return ResponseEntity.ok(response);
    }
}
