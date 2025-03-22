package com.controller;

import main.java.com.model.Notification;
import main.java.com.model.User;
import main.java.com.service.NotificationService;
import main.java.com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @Autowired
    public NotificationController(
            NotificationService notificationService,
            UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    public String listNotifications(Model model) {
        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        // Lấy danh sách thông báo
        List<Notification> notifications = notificationService.getNotificationsByUserId(user.getId());

        model.addAttribute("notifications", notifications);
        return "notifications/list";
    }

    @GetMapping("/{id}")
    public String viewNotification(@PathVariable("id") Long id, Model model) {
        try {
            // Lấy thông tin thông báo
            Notification notification = notificationService.getNotificationById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!notification.getUser().getId().equals(user.getId())) {
                return "redirect:/notifications?error=unauthorized";
            }

            // Đánh dấu thông báo đã đọc
            if (!notification.isRead()) {
                notificationService.markNotificationAsRead(id);
            }

            model.addAttribute("notification", notification);
            return "notifications/view";
        } catch (Exception e) {
            return "redirect:/notifications?error=notification-not-found";
        }
    }

    @GetMapping("/mark-all-read")
    public String markAllAsRead() {
        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        // Đánh dấu tất cả thông báo đã đọc
        notificationService.markAllNotificationsAsRead(user.getId());

        return "redirect:/notifications?marked-all-read";
    }

    @GetMapping("/{id}/delete")
    public String deleteNotification(@PathVariable("id") Long id) {
        try {
            // Lấy thông tin thông báo
            Notification notification = notificationService.getNotificationById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!notification.getUser().getId().equals(user.getId())) {
                return "redirect:/notifications?error=unauthorized";
            }

            // Xóa thông báo
            notificationService.deleteNotification(id);

            return "redirect:/notifications?deleted";
        } catch (Exception e) {
            return "redirect:/notifications?error=delete-failed";
        }
    }

    @GetMapping("/count-unread")
    @ResponseBody
    public long countUnreadNotifications() {
        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        // Đếm số lượng thông báo chưa đọc
        return notificationService.countUnreadNotifications(user.getId());
    }
}
