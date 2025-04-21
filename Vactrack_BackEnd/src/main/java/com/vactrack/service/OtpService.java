package com.vactrack.service;

import com.vactrack.model.User;
import com.vactrack.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    // Lưu OTP tạm vào bộ nhớ
    private Map<String, String> otpStorage = new HashMap<>();

    private String generateRandomPassword() {
        int length = 10;
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
        StringBuilder password = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }

    public void generateAndSendOtp(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Email không tồn tại");
        }

        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        otpStorage.put(email, otp);

        try {
            sendOtpEmail(email, otp);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email OTP", e);
        }
    }

    private void sendOtpEmail(String email, String otp) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("Mã Xác Thực (OTP) – Đặt Lại Mật Khẩu VacTrack");

        String htmlContent = String.format(
                "<p>Xin chào,</p>" +
                        "<p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản <strong>VacTrack</strong>.</p>" +
                        "<p>Mã xác thực (OTP) của bạn là: " +
                        "<strong style='color: #e63946; font-size: 20px;'>%s</strong></p>" +
                        "<p><em>Lưu ý:</em> Mã OTP có hiệu lực trong vòng <strong>5 phút</strong> kể từ khi nhận được email.</p>" +
                        "<p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>" +
                        "<br><p>Trân trọng,<br><strong>Đội ngũ VacTrack</strong></p>", otp);

        helper.setText(htmlContent, true); // Cho phép HTML

        mailSender.send(mimeMessage);
    }

    public boolean verifyOtp(String email, String inputOtp) {
        return otpStorage.containsKey(email) && otpStorage.get(email).equals(inputOtp);
    }

    public void clearOtp(String email) {
        otpStorage.remove(email);
    }

    public void sendNewPasswordEmail(String email, String newPassword) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("Mật khẩu mới – VacTrack");

        String htmlContent = String.format(
                "<p>Xin chào,</p>" +
                        "<p>Bạn vừa đặt lại mật khẩu trên hệ thống <strong>VacTrack</strong>.</p>" +
                        "<p>Mật khẩu mới của bạn là: " +
                        "<strong style='color: #1d3557; font-size: 18px;'>%s</strong></p>" +
                        "<p>Bạn nên đăng nhập và thay đổi lại mật khẩu trong mục cài đặt để bảo mật hơn.</p>" +
                        "<br><p>Trân trọng,<br><strong>Đội ngũ VacTrack</strong></p>", newPassword);

        helper.setText(htmlContent, true);
        mailSender.send(mimeMessage);
    }

}
