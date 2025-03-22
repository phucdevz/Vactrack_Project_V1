package com.controller;

import com.model.Appointment;
import com.model.Payment;
import com.model.User;
import com.service.AppointmentService;
import com.service.PaymentService;
import com.service.UserService;
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

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/admin/list")
    public String adminListPayments(
            @RequestParam(name = "status", required = false) Payment.Status status,
            Model model) {
        try {
            List<Payment> payments;
            Payment.Status filterStatus = status != null ? status : Payment.Status.PENDING;

            payments = paymentService.getPaymentsByStatus(filterStatus);
            model.addAttribute("payments", payments);
            model.addAttribute("statuses", Payment.Status.values());
            model.addAttribute("statusFilter", filterStatus);

            return "admin/payments/list";
        } catch (Exception e) {
            model.addAttribute("error", "Failed to load payments: " + e.getMessage());
            return "error";
        }
    }

    @GetMapping("/admin/{id}/confirm")
    public String adminConfirmPayment(@PathVariable("id") Long id, Model model) {
        try {
            paymentService.confirmPayment(id, "Confirmed by admin");
            return "redirect:/payments/admin/list?success=confirmed";
        } catch (Exception e) {
            model.addAttribute("error", "Confirmation failed: " + e.getMessage());
            return "redirect:/payments/admin/list?error=" + e.getMessage();
        }
    }

    @GetMapping("/admin/{id}/refund")
    public String showRefundForm(@PathVariable("id") Long id, Model model) {
        try {
            Payment payment = paymentService.getPaymentById(id);
            if (payment == null) {
                return "redirect:/payments/admin/list?error=payment-not-found";
            }

            if (payment.getStatus() != Payment.Status.COMPLETED) {
                return "redirect:/payments/admin/list?error=payment-not-completed";
            }

            model.addAttribute("payment", payment);
            return "admin/payments/refund";
        } catch (Exception e) {
            return "redirect:/payments/admin/list?error=" + e.getMessage();
        }
    }

    @PostMapping("/admin/{id}/refund")
    public String processRefund(
            @PathVariable("id") Long id,
            @RequestParam("reason") String reason,
            @RequestParam(name = "amount", required = false) BigDecimal amount,
            Model model) {
        try {
            if (reason == null || reason.trim().isEmpty()) {
                return "redirect:/payments/admin/list?error=reason-required";
            }

            if (amount != null && amount.compareTo(BigDecimal.ZERO) <= 0) {
                return "redirect:/payments/admin/list?error=invalid-amount";
            }

            if (amount != null) {
                paymentService.partialRefund(id, amount, reason);
            } else {
                paymentService.refundPayment(id, reason);
            }

            return "redirect:/payments/admin/list?success=refunded";
        } catch (Exception e) {
            model.addAttribute("error", "Refund failed: " + e.getMessage());
            return "redirect:/payments/admin/list?error=" + e.getMessage();
        }
    }
}