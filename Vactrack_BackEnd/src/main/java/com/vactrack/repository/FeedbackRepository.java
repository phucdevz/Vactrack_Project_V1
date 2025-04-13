package com.vactrack.repository;

import com.vactrack.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findAll(Pageable pageable);
    Page<Feedback> findByPublishedTrue(Pageable pageable);
    Page<Feedback> findByPublishedTrueAndRatingGreaterThanEqual(Integer rating, Pageable pageable);
}
