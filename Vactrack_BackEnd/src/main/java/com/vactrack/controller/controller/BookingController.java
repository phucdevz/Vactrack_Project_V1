package com.vactrack.controller;

import com.vactrack.model.Booking;
import com.vactrack.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/available-slots")
    public ResponseEntity<?> getAvailableTimeSlots(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {

        List<Map<String, Object>> availableSlots = bookingService.getAvailableTimeSlots(date);
        return ResponseEntity.ok(availableSlots);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> bookingData) {
        try {
            Booking newBooking = bookingService.createBooking(bookingData);
            return ResponseEntity.status(HttpStatus.CREATED).body(newBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }
}
