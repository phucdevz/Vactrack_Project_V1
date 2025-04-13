package com.vactrack.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.vactrack.exception.ApiException;
import com.vactrack.model.User;
import com.vactrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

@Component
public class JwtTokenProvider {

    private static final Logger logger = Logger.getLogger(JwtTokenProvider.class.getName());

    private final Algorithm algorithm;
    private final JWTVerifier verifier;
    private final UserRepository userRepository;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    public JwtTokenProvider(@Value("${jwt.secret:defaultSecretKeyForDevelopmentEnvironmentOnly}") String secretKey,
                            UserRepository userRepository) {
        this.algorithm = Algorithm.HMAC256(secretKey);
        this.verifier = JWT.require(algorithm).build();
        this.userRepository = userRepository;
        logger.info("JwtTokenProvider initialized with expiration: " + jwtExpiration + "ms");
    }

    /**
     * Generate a JWT token for a user with the given email
     */
    public String generateToken(String email) {
        try {
            // Find user by email
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                logger.warning("Failed to generate token: User not found with email: " + email);
                throw new ApiException("User not found with email: " + email, HttpStatus.NOT_FOUND);
            }

            User user = userOptional.get();
            return generateTokenFromUser(user);
        } catch (ApiException e) {
            // Re-throw API exceptions
            throw e;
        } catch (Exception e) {
            // Log and wrap other exceptions
            logger.log(Level.SEVERE, "Unexpected error generating token", e);
            throw new ApiException("Failed to generate token: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Generate a JWT token directly from a User object
     */
    public String generateTokenFromUser(User user) {
        try {
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpiration);

            String token = JWT.create()
                    .withSubject(user.getEmail())
                    .withClaim("userId", user.getId().toString())
                    .withClaim("role", user.getRole())
                    .withIssuedAt(now)
                    .withExpiresAt(expiryDate)
                    .sign(algorithm);

            logger.fine("Generated token for user: " + user.getEmail());
            return token;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error generating token for user: " + user.getEmail(), e);
            throw new ApiException("Failed to generate token: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Extract the userId from token
     */
    public String extractUserId(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);
            return jwt.getClaim("userId").asString();
        } catch (Exception e) {
            logger.warning("Failed to extract userId from token: " + e.getMessage());
            return null;
        }
    }

    public String extractEmail(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);
            return jwt.getSubject();
        } catch (Exception e) {
            logger.warning("Failed to extract email from token: " + e.getMessage());
            return null;
        }
    }

    public String extractRole(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);
            return jwt.getClaim("role").asString();
        } catch (Exception e) {
            logger.warning("Failed to extract role from token: " + e.getMessage());
            return null;
        }
    }

    public Date extractExpiration(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);
            return jwt.getExpiresAt();
        } catch (Exception e) {
            logger.warning("Failed to extract expiration from token: " + e.getMessage());
            return null;
        }
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = extractExpiration(token);
        return expiration != null && expiration.before(new Date());
    }

    public Boolean validateToken(String token) {
        try {
            // First verify the token signature
            verifier.verify(token);
            // Then check if it's expired
            boolean expired = isTokenExpired(token);
            if (expired) {
                logger.info("Token is expired");
            }
            return !expired;
        } catch (Exception e) {
            logger.warning("Token validation failed: " + e.getMessage());
            return false;
        }
    }
}
