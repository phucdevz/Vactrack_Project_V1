package com.vactrack.repository;

import com.vactrack.model.SocialUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocialUserRepository extends JpaRepository<SocialUser, Long> {
    Optional<SocialUser> findByProviderAndProviderId(String provider, String providerId);
    Optional<SocialUser> findByEmail(String email);
}