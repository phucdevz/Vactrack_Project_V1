package main.java.com.service;

import main.java.com.exception.ResourceNotFoundException;
import main.java.com.model.Appointment;
import main.java.com.model.Payment;
import main.java.com.repository.AppointmentRepository;
import main.java.com.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public PaymentService(
            PaymentRepository paymentRepository,
            AppointmentRepository appointmentRepository) {
        this.paymentRepository = paymentRepository;
        this.appointmentRepository = appointmentRepository;
    }

    /**
     * Tạo thanh toán mới
     */
    @Transactional
    public Payment createPayment(Payment payment, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        // Kiểm tra xem đã có thanh toán nào cho lịch hẹn này chưa
        Optional<Payment> existingPayment = paymentRepository.findByAppointmentId(appointmentId);
        if (existingPayment.isPresent()) {
            throw new IllegalStateException("Payment already exists for this appointment");
        }

        payment.setAppointment(appointment);
        payment.setStatus(Payment.Status.PENDING);
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    /**
     * Lấy thông tin thanh toán theo ID
     */
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
    }

    /**
     * Lấy thông tin thanh toán theo lịch hẹn
     */
    public Payment getPaymentByAppointmentId(Long appointmentId) {
        return paymentRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "appointmentId", appointmentId));
    }

    /**
     * Lấy danh sách thanh toán của người dùng
     */
    public List<Payment> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    /**
     * Lấy danh sách thanh toán theo trạng thái
     */
    public List<Payment> getPaymentsByStatus(Payment.Status status) {
        return paymentRepository.findByStatus(status);
    }

    /**
     * Lấy danh sách thanh toán trong khoảng thời gian
     */
    public List<Payment> getPaymentsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByPaymentDateBetween(startDate, endDate);
    }

    /**
     * Xác nhận thanh toán
     */
    @Transactional
    public Payment confirmPayment(Long id, String transactionId) {
        Payment payment = getPaymentById(id);
        payment.setStatus(Payment.Status.COMPLETED);
        payment.setTransactionId(transactionId);
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    /**
     * Đánh dấu thanh toán thất bại
     */
    @Transactional
    public Payment markPaymentAsFailed(Long id, String reason) {
        Payment payment = getPaymentById(id);
        payment.setStatus(Payment.Status.FAILED);
        payment.setNotes(reason);

        return paymentRepository.save(payment);
    }

    /**
     * Hoàn tiền thanh toán
     */
    @Transactional
    public Payment refundPayment(Long id, String reason) {
        Payment payment = getPaymentById(id);

        // Chỉ cho phép hoàn tiền nếu thanh toán đã hoàn thành
        if (payment.getStatus() != Payment.Status.COMPLETED) {
            throw new IllegalStateException("Only completed payments can be refunded");
        }

        payment.setStatus(Payment.Status.REFUNDED);
        payment.setNotes(reason);

        return paymentRepository.save(payment);
    }

    /**
     * Hoàn tiền một phần
     */
    @Transactional
    public Payment partialRefund(Long id, BigDecimal refundAmount, String reason) {
        Payment payment = getPaymentById(id);

        // Chỉ cho phép hoàn tiền nếu thanh toán đã hoàn thành
        if (payment.getStatus() != Payment.Status.COMPLETED) {
            throw new IllegalStateException("Only completed payments can be refunded");
        }

        // Kiểm tra số tiền hoàn trả
        if (refundAmount.compareTo(payment.getAmount()) > 0) {
            throw new IllegalArgumentException("Refund amount cannot be greater than the original payment amount");
        }

        payment.setStatus(Payment.Status.PARTIALLY_REFUNDED);
        payment.setNotes("Partial refund: " + refundAmount + ". Reason: " + reason);

        return paymentRepository.save(payment);
    }

    /**
     * Cập nhật thông tin thanh toán
     */
    @Transactional
    public Payment updatePayment(Long id, Payment paymentDetails) {
        Payment payment = getPaymentById(id);

        // Chỉ cho phép cập nhật nếu thanh toán chưa hoàn thành
        if (payment.getStatus() == Payment.Status.COMPLETED ||
                payment.getStatus() == Payment.Status.REFUNDED ||
                payment.getStatus() == Payment.Status.PARTIALLY_REFUNDED) {
            throw new IllegalStateException("Cannot update a completed or refunded payment");
        }

        payment.setAmount(paymentDetails.getAmount());
        payment.setPaymentMethod(paymentDetails.getPaymentMethod());
        payment.setNotes(paymentDetails.getNotes());

        return paymentRepository.save(payment);
    }

    /**
     * Xóa thanh toán
     */
    @Transactional
    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Payment", "id", id);
        }

        paymentRepository.deleteById(id);
    }
}
