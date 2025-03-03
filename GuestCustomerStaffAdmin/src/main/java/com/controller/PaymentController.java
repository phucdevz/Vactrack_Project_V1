package main.java.com.controller;

import main.java.com.model.Appointment;
import main.java.com.model.Payment;
import main.java.com.model.User;
import main.java.com.service.AppointmentService;
import main.java.com.service.PaymentService;
import main.java.com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("/payments")
public class PaymentController {

    // ... (phần code trước đó)

    @GetMapping("/admin/list")
    public String adminListPayments(
            @RequestParam(name = "status", required = false) Payment.Status status,
            Model model) {

        List<Payment> payments;

        if (status != null) {
            payments = paymentService.getPaymentsByStatus(status);
            model.addAttribute("statusFilter", status);
        } else {
            payments = paymentService.getPaymentsByStatus(Payment.Status.PENDING);
            model.addAttribute("statusFilter", Payment.Status.PENDING);
        }

        model.addAttribute("payments", payments);
        model.addAttribute("statuses", Payment.Status.values());

        return "admin/payments/list";
    }

    @GetMapping("/admin/{id}/confirm")
    public String adminConfirmPayment(@PathVariable("id") Long id) {
        try {
            paymentService.confirmPayment(id, "Confirmed by admin");
            return "redirect:/payments/admin/list?confirmed";
        } catch (Exception e) {
            return "redirect:/payments/admin/list?error=confirm-failed";
        }
    }

    @GetMapping("/admin/{id}/refund")
    public String showRefundForm(@PathVariable("id") Long id, Model model) {
        try {
            Payment payment = paymentService.getPaymentById(id);

            // Kiểm tra trạng thái thanh toán
            if (payment.getStatus() != Payment.Status.COMPLETED) {
                return "redirect:/payments/admin/list?error=not-completed";
            }

            model.addAttribute("payment", payment);
            return "admin/payments/refund";
        } catch (Exception e) {
            return "redirect:/payments/admin/list?error=payment-not-found";
        }
    }

    @PostMapping("/admin/{id}/refund")
    public String processRefund(
            @PathVariable("id") Long id,
            @RequestParam("reason") String reason,
            @RequestParam(name = "amount", required = false) BigDecimal amount) {

        try {
            if (amount != null) {
                // Hoàn tiền một phần
                paymentService.partialRefund(id, amount, reason);
            } else {
                // Hoàn tiền toàn bộ
                paymentService.refundPayment(id, reason);
            }

            return "redirect:/payments/admin/list?refunded";
        } catch (Exception e) {
            return "redirect:/payments/admin/list?error=refund-failed";
        }
    }
}