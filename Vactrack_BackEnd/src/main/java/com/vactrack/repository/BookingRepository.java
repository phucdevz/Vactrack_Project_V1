package com.vactrack.repository;

import com.vactrack.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    Optional<Booking> findByBookingId(String bookingId);

    Optional<Booking> findByBookingIdAndUserId(String bookingId, Long userId);

    boolean existsByBookingIdAndUserId(String bookingId, Long userId);
}
