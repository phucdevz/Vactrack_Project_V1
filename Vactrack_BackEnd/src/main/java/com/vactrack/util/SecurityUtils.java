package com.vactrack.util;

import com.vactrack.exception.ApiException;
import com.vactrack.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class SecurityUtils {

    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public SecurityUtils(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Lấy ID của User hiện tại từ token
     */
    public Long getCurrentUserId() {
        String token = extractTokenFromRequest();
        if (token == null) {
            throw new ApiException("No authentication token found", HttpStatus.UNAUTHORIZED);
        }

        try {
            String userIdString = jwtTokenProvider.extractUserId(token);
            if (userIdString == null) {
                throw new ApiException("Invalid authentication token", HttpStatus.UNAUTHORIZED);
            }

            return Long.parseLong(userIdString);
        } catch (NumberFormatException e) {
            throw new ApiException("Invalid user ID in token", HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Trích xuất token từ request hiện tại
     */
    private String extractTokenFromRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new ApiException("No request context found", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        HttpServletRequest request = attributes.getRequest();
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
