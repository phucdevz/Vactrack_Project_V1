package com.repository;

import com.model.Child;
import com.model.VaccinationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VaccinationScheduleRepository extends JpaRepository<VaccinationSchedule, Long> {
    Optional<VaccinationSchedule> findByChild(Child child);
    Optional<VaccinationSchedule> findByChildId(Long childId);
}