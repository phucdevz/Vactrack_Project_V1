package com.vactrack.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.vactrack.model.User;
import com.vactrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function;

@Component
public class JwtTokenProvider {

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
    }

    public String generateToken(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return JWT.create()
                .withSubject(email)
                .withClaim("userId", user.getId().toString())
                .withClaim("role", user.getRole())
                .withIssuedAt(now)
                .withExpiresAt(expiryDate)
                .sign(algorithm);
    }

    public String extractEmail(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);
            return jwt.getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public String extractRole(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);
            return jwt.getClaim("role").asString();
        } catch (Exception e) {
            return null;
        }
    }

    public Date extractExpiration(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);
            return jwt.getExpiresAt();
        } catch (Exception e) {
            return null;
        }
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = extractExpiration(token);
        return expiration != null && expiration.before(new Date());
    }

    public Boolean validateToken(String token) {
        try {
            verifier.verify(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}
