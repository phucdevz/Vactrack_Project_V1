package main.java.com.repository;

import main.java.com.model.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, Long> {
    List<Vaccine> findByIsActiveTrue();
    List<Vaccine> findByRecommendedAgeContaining(String ageRange);
}