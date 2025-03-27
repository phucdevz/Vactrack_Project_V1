package com.vactrack.controller;

import com.vactrack.dto.LoginRequest;
import com.vactrack.dto.RegisterRequest;
import com.vactrack.dto.AuthResponse;
import com.vactrack.model.User;
import com.vactrack.security.JwtTokenProvider;
import com.vactrack.service.AuthService;
import com.vactrack.service.SocialLoginService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @Autowired
    private SocialLoginService socialLoginService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.facebook.client-id:}")
    private String facebookClientId;

    @PostConstruct
    public void init() {
        System.out.println("========= OAuth Configuration =========");
        System.out.println("Loaded Google Client ID: " + googleClientId);
        System.out.println("Loaded Facebook Client ID: " + facebookClientId);
        System.out.println("=======================================");
    }

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    /**
     * Endpoint để chuyển hướng đến trang đăng nhập Google
     */
    @GetMapping("/google")
    public void loginWithGoogle(HttpServletResponse response) throws IOException {
        String googleAuthUrl = "https://accounts.google.com/o/oauth2/auth" +
                "?client_id=" + googleClientId +
                "&redirect_uri=http://localhost:8080/api/auth/google/callback" +
                "&response_type=code" +
                "&scope=email profile";

        System.out.println("Google Auth URL: " + googleAuthUrl);

        response.sendRedirect(googleAuthUrl);
    }

    /**
     * Endpoint để chuyển hướng đến trang đăng nhập Facebook
     */
    @GetMapping("/facebook")
    public void loginWithFacebook(HttpServletResponse response) throws IOException {
        String facebookAuthUrl = "https://www.facebook.com/v12.0/dialog/oauth" +
                "?client_id=" + facebookClientId +
                "&redirect_uri=http://localhost:8080/api/auth/facebook/callback" +
                "&response_type=code" +
                "&scope=email public_profile";

        System.out.println("Facebook Auth URL: " + facebookAuthUrl);

        response.sendRedirect(facebookAuthUrl);
    }

    /**
     * Xử lý callback từ Google OAuth
     */
    @GetMapping("/google/callback")
    public ResponseEntity<?> handleGoogleCallback(@RequestParam("code") String code) {
        try {
            System.out.println("Received Google OAuth code: " + code);

            // Trong môi trường thực tế, bạn sẽ trao đổi code để lấy access token
            // và sau đó lấy thông tin người dùng từ Google API như sau:

            /*
            // 1. Trao đổi code lấy access token
            String tokenUrl = "https://oauth2.googleapis.com/token";
            MultiValueMap<String, String> tokenRequest = new LinkedMultiValueMap<>();
            tokenRequest.add("code", code);
            tokenRequest.add("client_id", googleClientId);
            tokenRequest.add("client_secret", googleClientSecret);
            tokenRequest.add("redirect_uri", "http://localhost:8080/api/auth/google/callback");
            tokenRequest.add("grant_type", "authorization_code");

            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(
                    tokenUrl, tokenRequest, Map.class);

            // 2. Trích xuất access token
            String accessToken = (String) tokenResponse.getBody().get("access_token");

            // 3. Lấy thông tin người dùng
            String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<String> entity = new HttpEntity<>("", headers);

            ResponseEntity<Map> userResponse = restTemplate.exchange(
                    userInfoUrl, HttpMethod.GET, entity, Map.class);

            // 4. Trích xuất thông tin người dùng
            Map<String, Object> userAttributes = userResponse.getBody();
            String email = (String) userAttributes.get("email");
            String name = (String) userAttributes.get("name");
            String picture = (String) userAttributes.get("picture");
            */

            // Tạm thời dùng dữ liệu giả để minh họa
            String email = "user@example.com";
            String name = "Google User";

            // Xử lý thông tin người dùng
            User user = socialLoginService.processOAuthUser("google", "google-123", email, name);
            String token = tokenProvider.generateToken(user.getEmail());

            // Trong thực tế, bạn nên chuyển hướng về frontend với token
            // Ví dụ: response.sendRedirect("http://frontend.com/oauth/callback?token=" + token);

            // Trả về token và thông tin người dùng
            return ResponseEntity.ok(new AuthResponse(token, user));

        } catch (Exception e) {
            System.err.println("Error processing Google callback: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process Google authentication: " + e.getMessage()));
        }
    }

    /**
     * Xử lý callback từ Facebook OAuth
     */
    @GetMapping("/facebook/callback")
    public ResponseEntity<?> handleFacebookCallback(@RequestParam("code") String code) {
        try {
            System.out.println("Received Facebook OAuth code: " + code);

            // Tương tự như Google callback, trong thực tế bạn sẽ:
            // 1. Trao đổi code để lấy access token
            // 2. Dùng access token để lấy thông tin người dùng từ Facebook API

            // Tạm thời dùng dữ liệu giả
            String email = "user@example.com";
            String name = "Facebook User";

            User user = socialLoginService.processOAuthUser("facebook", "facebook-123", email, name);
            String token = tokenProvider.generateToken(user.getEmail());

            return ResponseEntity.ok(new AuthResponse(token, user));

        } catch (Exception e) {
            System.err.println("Error processing Facebook callback: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process Facebook authentication: " + e.getMessage()));
        }
    }

    /**
     * Endpoint để kiểm tra cấu hình OAuth
     */
    @GetMapping("/oauth-config")
    public ResponseEntity<?> getOAuthConfig() {
        return ResponseEntity.ok(Map.of(
                "googleClientConfigured", googleClientId != null && !googleClientId.isEmpty(),
                "facebookClientConfigured", facebookClientId != null && !facebookClientId.isEmpty()
        ));
    }
}