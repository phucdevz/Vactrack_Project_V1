package main.java.com.service;

import main.java.com.model.Appointment;
import main.java.com.model.Child;
import main.java.com.model.ScheduleItem;
import main.java.com.model.User;
import main.java.com.repository.AppointmentRepository;
import main.java.com.repository.ChildRepository;
import main.java.com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class SchedulingService {

    private final AppointmentRepository appointmentRepository;
    private final ChildRepository childRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Autowired
    public SchedulingService(
            AppointmentRepository appointmentRepository,
            ChildRepository childRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.childRepository = childRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    /**
     * Gửi thông báo nhắc nhở lịch hẹn ngày mai
     * Chạy hàng ngày vào 8 giờ sáng
     */
    @Scheduled(cron = "0 0 8 * * ?")
    @Transactional
    public void sendAppointmentReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        // Lấy danh sách lịch hẹn ngày mai đã xác nhận
        List<Appointment> appointments = appointmentRepository.findByDateAndStatus(
                tomorrow, Appointment.Status.CONFIRMED);

        for (Appointment appointment : appointments) {
            Child child = appointment.getChild();
            User parent = child.getParent();

            String appointmentInfo = "Thời gian: " + appointment.getAppointmentTime() +
                    ", Trẻ: " + child.getName();

            notificationService.sendAppointmentReminder(
                    parent.getId(), appointment.getId(), appointmentInfo);

            // Gửi email hoặc SMS nếu cần
            // emailService.sendAppointmentReminder(parent.getEmail(), appointment);
            // smsService.sendAppointmentReminder(parent.getPhone(), appointment);
        }
    }

    /**
     * Gửi thông báo nhắc nhở tiêm chủng sắp đến hạn
     * Chạy hàng ngày vào 9 giờ sáng
     */
    @Scheduled(cron = "0 0 9 * * ?")
    @Transactional
    public void sendVaccinationDueReminders() {
        LocalDate nextWeek = LocalDate.now().plusDays(7);

        // Giả sử có một phương thức để lấy các mục lịch tiêm sắp đến hạn
        // List<ScheduleItem> dueItems = scheduleItemRepository.findByRecommendedDateAndStatus(
        //        nextWeek, ScheduleItem.Status.PENDING);

        // Đoạn code này giả định, bạn cần thay thế bằng logic thực tế
        // for (ScheduleItem item : dueItems) {
        //    Child child = item.getSchedule().getChild();
        //    User parent = child.getParent();
        //
        //    String vaccineInfo = "Vắc-xin: " + item.getVaccine().getName() +
        //                        ", Liều: " + item.getDoseNumber();
        //
        //    notificationService.sendVaccinationDueReminder(
        //            parent.getId(), child.getName(), vaccineInfo);
        // }
    }

    /**
     * Tự động cập nhật trạng thái lịch hẹn đã qua
     * Chạy hàng ngày vào nửa đêm
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void updateMissedAppointments() {
        LocalDate yesterday = LocalDate.now().minusDays(1);

        List<Appointment> appointments = appointmentRepository.findByDateAndStatus(
                yesterday, Appointment.Status.CONFIRMED);

        for (Appointment appointment : appointments) {
            appointment.setStatus(Appointment.Status.NO_SHOW);
            appointmentRepository.save(appointment);

            // Thông báo cho người dùng
            Child child = appointment.getChild();
            User parent = child.getParent();

            // notificationService.sendAppointmentMissedNotification(parent.getId(), appointment.getId());
        }
    }
}
