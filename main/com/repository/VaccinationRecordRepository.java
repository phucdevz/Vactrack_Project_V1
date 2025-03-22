package com.repository;

import main.java.com.model.Child;
import main.java.com.model.Vaccine;
import main.java.com.model.VaccinationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VaccinationRecordRepository extends JpaRepository<VaccinationRecord, Long> {
    List<VaccinationRecord> findByChild(Child child);
    List<VaccinationRecord> findByChildId(Long childId);
    List<VaccinationRecord> findByVaccine(Vaccine vaccine);
    List<VaccinationRecord> findByVaccinationDateBetween(LocalDate startDate, LocalDate endDate);
    Optional<VaccinationRecord> findByChildAndVaccineAndDoseNumber(Child child, Vaccine vaccine, Integer doseNumber);
}