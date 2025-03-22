package com.repository;

import main.java.com.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Feedback> findByIsPublicTrueOrderByCreatedAtDesc();
    List<Feedback> findByType(Feedback.FeedbackType type);

    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double getAverageRating();

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.type = :type")
    Double getAverageRatingByType(Feedback.FeedbackType type);
}