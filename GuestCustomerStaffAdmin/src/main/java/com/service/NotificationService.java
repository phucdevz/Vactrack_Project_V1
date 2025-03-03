package main.java.com.service;

import main.java.com.exception.ResourceNotFoundException;
import main.java.com.model.Notification;
import main.java.com.model.User;
import main.java.com.repository.NotificationRepository;
import main.java.com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Autowired
    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Tạo thông báo mới
     */
    @Transactional
    public Notification createNotification(Notification notification, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        notification.setUser(user);
        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    /**
     * Lấy thông báo theo ID
     */
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
    }

    /**
     * Lấy danh sách thông báo của người dùng
     */
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Lấy danh sách thông báo chưa đọc của người dùng
     */
    public List<Notification> getUnreadNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    /**
     * Đếm số lượng thông báo chưa đọc
     */
    public long countUnreadNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    /**
     * Đánh dấu thông báo đã đọc
     */
    @Transactional
    public Notification markNotificationAsRead(Long id) {
        Notification notification = getNotificationById(id);
        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    /**
     * Đánh dấu tất cả thông báo của người dùng đã đọc
     */
    @Transactional
    public void markAllNotificationsAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);

        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    /**
     * Xóa thông báo
     */
    @Transactional
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification", "id", id);
        }

        notificationRepository.deleteById(id);
    }

    /**
     * Gửi thông báo nhắc nhở lịch hẹn
     */
    @Transactional
    public Notification sendAppointmentReminder(Long userId, Long appointmentId, String appointmentInfo) {
        Notification notification = new Notification();
        notification.setTitle("Nhắc nhở lịch hẹn tiêm chủng");
        notification.setContent("Bạn có lịch hẹn tiêm chủng vào ngày mai. " + appointmentInfo);
        notification.setType(Notification.NotificationType.APPOINTMENT_REMINDER);

        return createNotification(notification, userId);
    }

    /**
     * Gửi thông báo xác nhận lịch hẹn
     */
    @Transactional
    public Notification sendAppointmentConfirmation(Long userId, Long appointmentId, String appointmentInfo) {
        Notification notification = new Notification();
        notification.setTitle("Xác nhận lịch hẹn tiêm chủng");
        notification.setContent("Lịch hẹn tiêm chủng của bạn đã được xác nhận. " + appointmentInfo);
        notification.setType(Notification.NotificationType.APPOINTMENT_CONFIRMATION);

        return createNotification(notification, userId);
    }

    /**
     * Gửi thông báo nhắc nhở tiêm chủng
     */
    @Transactional
    public Notification sendVaccinationDueReminder(Long userId, String childName, String vaccineInfo) {
        Notification notification = new Notification();
        notification.setTitle("Nhắc nhở tiêm chủng");
        notification.setContent("Đã đến lịch tiêm chủng cho bé " + childName + ". " + vaccineInfo);
        notification.setType(Notification.NotificationType.VACCINATION_DUE);

        return createNotification(notification, userId);
    }
}
