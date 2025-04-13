package com.vactrack.service;

import com.vactrack.dto.BookingRequest;
import com.vactrack.dto.BookingResponse;
import com.vactrack.exception.ApiException;
import com.vactrack.model.Booking;
import com.vactrack.repository.BookingRepository;
import com.vactrack.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SecurityUtils securityUtils;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;

    @Autowired
    public BookingService(BookingRepository bookingRepository, SecurityUtils securityUtils) {
        this.bookingRepository = bookingRepository;
        this.securityUtils = securityUtils;
    }

    /**
     * Lấy tất cả đặt lịch của người dùng hiện tại
     */
    public List<BookingResponse> getAllBookings() {
        Long currentUserId = securityUtils.getCurrentUserId();

        return bookingRepository.findByUserId(currentUserId).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin đặt lịch theo ID (chỉ của người dùng hiện tại)
     */
    public BookingResponse getBookingById(String bookingId) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Booking booking = bookingRepository.findByBookingIdAndUserId(bookingId, currentUserId)
                .orElseThrow(() -> new ApiException("Booking not found with id: " + bookingId, HttpStatus.NOT_FOUND));

        return mapToBookingResponse(booking);
    }

    /**
     * Tạo mới đặt lịch cho người dùng hiện tại
     */
    @Transactional
    public BookingResponse createBooking(BookingRequest bookingRequest) {
        Long currentUserId = securityUtils.getCurrentUserId();

        try {
            Booking booking = new Booking();

            // Tạo booking ID (BK + random string)
            String bookingId = "BK" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
            booking.setBookingId(bookingId);

            // Thiết lập user ID từ thông tin xác thực
            booking.setUserId(currentUserId);

            // Map các trường từ request sang entity
            booking.setPatientName(bookingRequest.getPatientName());
            booking.setPatientDob(LocalDate.parse(bookingRequest.getPatientDob(), DATE_FORMATTER));
            booking.setServiceType(bookingRequest.getServiceType());
            booking.setPackageType(bookingRequest.getPackageType());
            booking.setAppointmentDate(LocalDate.parse(bookingRequest.getAppointmentDate(), DATE_FORMATTER));
            booking.setAppointmentTime(LocalTime.parse(bookingRequest.getAppointmentTime(), TIME_FORMATTER));
            booking.setStatus(bookingRequest.getStatus() != null ? bookingRequest.getStatus() : "pending");
            booking.setNotes(bookingRequest.getNotes());

            // Thiết lập thời gian tạo
            booking.setCreatedAt(LocalDateTime.now());

            Booking savedBooking = bookingRepository.save(booking);
            return mapToBookingResponse(savedBooking);

        } catch (DateTimeParseException e) {
            throw new ApiException("Invalid date or time format. Use yyyy-MM-dd for dates and HH:mm for times.",
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            throw new ApiException("Error creating booking: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Cập nhật thông tin đặt lịch (chỉ của người dùng hiện tại)
     */
    @Transactional
    public BookingResponse updateBooking(String bookingId, BookingRequest bookingRequest) {
        Long currentUserId = securityUtils.getCurrentUserId();

        try {
            Booking booking = bookingRepository.findByBookingIdAndUserId(bookingId, currentUserId)
                    .orElseThrow(() -> new ApiException("Booking not found with id: " + bookingId, HttpStatus.NOT_FOUND));

            // Cập nhật các trường từ request
            if (bookingRequest.getPatientName() != null) {
                booking.setPatientName(bookingRequest.getPatientName());
            }

            if (bookingRequest.getPatientDob() != null) {
                booking.setPatientDob(LocalDate.parse(bookingRequest.getPatientDob(), DATE_FORMATTER));
            }

            if (bookingRequest.getServiceType() != null) {
                booking.setServiceType(bookingRequest.getServiceType());
            }

            if (bookingRequest.getPackageType() != null) {
                booking.setPackageType(bookingRequest.getPackageType());
            }

            if (bookingRequest.getAppointmentDate() != null) {
                booking.setAppointmentDate(LocalDate.parse(bookingRequest.getAppointmentDate(), DATE_FORMATTER));
            }

            if (bookingRequest.getAppointmentTime() != null) {
                booking.setAppointmentTime(LocalTime.parse(bookingRequest.getAppointmentTime(), TIME_FORMATTER));
            }

            if (bookingRequest.getStatus() != null) {
                booking.setStatus(bookingRequest.getStatus());
            }

            if (bookingRequest.getNotes() != null) {
                booking.setNotes(bookingRequest.getNotes());
            }

            Booking updatedBooking = bookingRepository.save(booking);
            return mapToBookingResponse(updatedBooking);

        } catch (DateTimeParseException e) {
            throw new ApiException("Invalid date or time format. Use yyyy-MM-dd for dates and HH:mm for times.",
                    HttpStatus.BAD_REQUEST);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException("Error updating booking: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Xóa đặt lịch (chỉ của người dùng hiện tại)
     */
    @Transactional
    public void deleteBooking(String bookingId) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Booking booking = bookingRepository.findByBookingIdAndUserId(bookingId, currentUserId)
                .orElseThrow(() -> new ApiException("Booking not found with id: " + bookingId, HttpStatus.NOT_FOUND));

        bookingRepository.delete(booking);
    }

    /**
     * Chuyển đổi từ Booking entity sang BookingResponse DTO
     */
    private BookingResponse mapToBookingResponse(Booking booking) {
        return new BookingResponse(
                booking.getBookingId(),
                booking.getUserId().toString(),
                booking.getPatientName(),
                booking.getPatientDob().format(DATE_FORMATTER),
                booking.getServiceType(),
                booking.getPackageType(),
                booking.getAppointmentDate().format(DATE_FORMATTER),
                booking.getAppointmentTime().format(TIME_FORMATTER),
                booking.getStatus(),
                booking.getNotes(),
                booking.getCreatedAt().format(DATETIME_FORMATTER)
        );
    }
}
