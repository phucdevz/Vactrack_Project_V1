package com.vactrack.repository;

import com.vactrack.model.Vaccine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, Long> {

    @Query("SELECT v FROM Vaccine v WHERE " +
            "(:category IS NULL OR v.category = :category) AND " +
            "(:search IS NULL OR LOWER(v.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(v.manufacturer) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Vaccine> findWithFilters(
            @Param("category") String category,
            @Param("search") String search,
            Pageable pageable);
}