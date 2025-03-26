package com.vactrack.service;

import com.vactrack.dto.AuthResponse;
import com.vactrack.dto.LoginRequest;
import com.vactrack.dto.RegisterRequest;
import com.vactrack.exception.ApiException;
import com.vactrack.model.User;
import com.vactrack.repository.UserRepository;
import com.vactrack.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        try {
            logger.info("Attempting to register user with email: {}", request.getEmail());

            // Kiểm tra email đã tồn tại chưa
            if (userRepository.existsByEmail(request.getEmail())) {
                logger.warn("Email already in use: {}", request.getEmail());
                throw new ApiException("Email đã được sử dụng", HttpStatus.BAD_REQUEST);
            }

            // Tạo và lưu người dùng mới
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            // Thiết lập role mặc định là "USER"
            user.setRole("USER");

            User savedUser = userRepository.save(user);
            logger.info("User registered successfully: {}", savedUser.getEmail());

            // Tạo JWT token
            String token = jwtTokenProvider.generateToken(savedUser.getEmail());

            return new AuthResponse(token, savedUser);
        } catch (Exception e) {
            // Log lỗi chi tiết
            if (!(e instanceof ApiException)) {
                logger.error("Error during registration", e);
                throw new ApiException("Lỗi khi đăng ký: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            throw e;
        }
    }

    public AuthResponse login(LoginRequest request) {
        try {
            logger.info("Attempting login for email: {}", request.getEmail());

            // Tìm người dùng theo email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        logger.warn("User not found with email: {}", request.getEmail());
                        return new ApiException("Email hoặc mật khẩu không đúng", HttpStatus.UNAUTHORIZED);
                    });

            // Kiểm tra mật khẩu
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                logger.warn("Invalid password for user: {}", request.getEmail());
                throw new ApiException("Email hoặc mật khẩu không đúng", HttpStatus.UNAUTHORIZED);
            }

            logger.info("User logged in successfully: {}", user.getEmail());

            // Tạo JWT token
            String token = jwtTokenProvider.generateToken(user.getEmail());

            return new AuthResponse(token, user);
        } catch (Exception e) {
            if (!(e instanceof ApiException)) {
                logger.error("Error during login", e);
                throw new ApiException("Lỗi khi đăng nhập: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            throw e;
        }
    }
}
