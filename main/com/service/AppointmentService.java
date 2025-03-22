package com.service;

import main.java.com.exception.ResourceNotFoundException;
import main.java.com.model.*;
import main.java.com.repository.AppointmentRepository;
import main.java.com.repository.ChildRepository;
import main.java.com.repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ChildRepository childRepository;
    private final VaccineRepository vaccineRepository;

    @Autowired
    public AppointmentService(
            AppointmentRepository appointmentRepository,
            ChildRepository childRepository,
            VaccineRepository vaccineRepository) {
        this.appointmentRepository = appointmentRepository;
        this.childRepository = childRepository;
        this.vaccineRepository = vaccineRepository;
    }

    /**
     * Tạo lịch hẹn tiêm chủng mới
     */
    @Transactional
    public Appointment createAppointment(Appointment appointment, Long childId, List<Long> vaccineIds) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child", "id", childId));

        appointment.setChild(child);
        appointment.setStatus(Appointment.Status.PENDING);

        // Lưu trước để có ID
        appointment = appointmentRepository.save(appointment);

        // Thêm các vắc-xin vào lịch hẹn
        Set<AppointmentVaccine> appointmentVaccines = new HashSet<>();
        for (Long vaccineId : vaccineIds) {
            Vaccine vaccine = vaccineRepository.findById(vaccineId)
                    .orElseThrow(() -> new ResourceNotFoundException("Vaccine", "id", vaccineId));

            AppointmentVaccine appointmentVaccine = new AppointmentVaccine();
            appointmentVaccine.setAppointment(appointment);
            appointmentVaccine.setVaccine(vaccine);
            appointmentVaccine.setStatus(AppointmentVaccine.Status.PENDING);

            // Xác định số liều
            // Đây là logic đơn giản, bạn có thể cần điều chỉnh dựa trên yêu cầu cụ thể
            appointmentVaccine.setDoseNumber(1);

            appointmentVaccines.add(appointmentVaccine);
        }

        appointment.setAppointmentVaccines(appointmentVaccines);

        // Xác định loại lịch hẹn dựa trên số lượng vắc-xin
        if (vaccineIds.size() == 1) {
            appointment.setType(Appointment.AppointmentType.SINGLE_VACCINE);
        } else {
            appointment.setType(Appointment.AppointmentType.MULTIPLE_VACCINES);
        }

        return appointmentRepository.save(appointment);
    }

    /**
     * Lấy thông tin lịch hẹn theo ID
     */
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
    }

    /**
     * Lấy danh sách lịch hẹn của một trẻ em
     */
    public List<Appointment> getAppointmentsByChildId(Long childId) {
        return appointmentRepository.findByChildId(childId);
    }

    /**
     * Lấy danh sách lịch hẹn của một phụ huynh
     */
    public List<Appointment> getAppointmentsByParentId(Long parentId) {
        return appointmentRepository.findByParentId(parentId);
    }

    /**
     * Lấy danh sách lịch hẹn theo ngày
     */
    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    /**
     * Lấy danh sách lịch hẹn trong khoảng thời gian
     */
    public List<Appointment> getAppointmentsBetweenDates(LocalDate startDate, LocalDate endDate) {
        return appointmentRepository.findByAppointmentDateBetween(startDate, endDate);
    }

    /**
     * Lấy danh sách lịch hẹn theo trạng thái
     */
    public List<Appointment> getAppointmentsByStatus(Appointment.Status status) {
        return appointmentRepository.findByStatus(status);
    }

    /**
     * Cập nhật trạng thái lịch hẹn
     */
    @Transactional
    public Appointment updateAppointmentStatus(Long id, Appointment.Status status) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    /**
     * Cập nhật thông tin lịch hẹn
     */
    @Transactional
    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Appointment appointment = getAppointmentById(id);

        // Chỉ cho phép cập nhật nếu lịch hẹn chưa hoàn thành
        if (appointment.getStatus() == Appointment.Status.COMPLETED) {
            throw new IllegalStateException("Cannot update a completed appointment");
        }

        appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
        appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
        appointment.setNotes(appointmentDetails.getNotes());

        return appointmentRepository.save(appointment);
    }

    /**
     * Hủy lịch hẹn
     */
    @Transactional
    public Appointment cancelAppointment(Long id, String reason) {
        Appointment appointment = getAppointmentById(id);

        // Chỉ cho phép hủy nếu lịch hẹn chưa hoàn thành
        if (appointment.getStatus() == Appointment.Status.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed appointment");
        }

        appointment.setStatus(Appointment.Status.CANCELLED);
        appointment.setNotes(reason);

        return appointmentRepository.save(appointment);
    }

    /**
     * Đánh dấu lịch hẹn đã hoàn thành
     */
    @Transactional
    public Appointment completeAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus(Appointment.Status.COMPLETED);

        // Cập nhật trạng thái các vắc-xin trong lịch hẹn
        for (AppointmentVaccine av : appointment.getAppointmentVaccines()) {
            av.setStatus(AppointmentVaccine.Status.COMPLETED);
        }

        return appointmentRepository.save(appointment);
    }

    /**
     * Xóa lịch hẹn
     */
    @Transactional
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment", "id", id);
        }

        appointmentRepository.deleteById(id);
    }
}
