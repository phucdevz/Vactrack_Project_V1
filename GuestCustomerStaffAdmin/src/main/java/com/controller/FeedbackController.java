package main.java.com.controller;

import main.java.com.model.Feedback;
import main.java.com.model.User;
import main.java.com.service.FeedbackService;
import main.java.com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final UserService userService;

    @Autowired
    public FeedbackController(
            FeedbackService feedbackService,
            UserService userService) {
        this.feedbackService = feedbackService;
        this.userService = userService;
    }

    @GetMapping
    public String showFeedbackForm(Model model) {
        model.addAttribute("feedback", new Feedback());
        model.addAttribute("feedbackTypes", Feedback.FeedbackType.values());
        return "feedback/form";
    }

    @PostMapping
    public String submitFeedback(@Valid @ModelAttribute("feedback") Feedback feedback,
                                 BindingResult result, Model model) {

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            model.addAttribute("feedbackTypes", Feedback.FeedbackType.values());
            return "feedback/form";
        }

        try {
            // Lấy thông tin người dùng hiện tại
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            // Tạo đánh giá
            feedbackService.createFeedback(feedback, user.getId());

            model.addAttribute("success", "Cảm ơn bạn đã gửi đánh giá!");
            return "feedback/success";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
            model.addAttribute("feedbackTypes", Feedback.FeedbackType.values());
            return "feedback/form";
        }
    }

    @GetMapping("/list")
    public String listMyFeedback(Model model) {
        // Lấy thông tin người dùng hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        // Lấy danh sách đánh giá của người dùng
        List<Feedback> feedbacks = feedbackService.getFeedbacksByUserId(user.getId());

        model.addAttribute("feedbacks", feedbacks);
        return "feedback/my-list";
    }

    @GetMapping("/public")
    public String listPublicFeedback(Model model) {
        // Lấy danh sách đánh giá công khai
        List<Feedback> publicFeedbacks = feedbackService.getPublicFeedbacks();

        // Lấy điểm đánh giá trung bình
        Double averageRating = feedbackService.getAverageRating();

        model.addAttribute("feedbacks", publicFeedbacks);
        model.addAttribute("averageRating", averageRating);
        return "feedback/public-list";
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable("id") Long id, Model model) {
        try {
            // Lấy thông tin đánh giá
            Feedback feedback = feedbackService.getFeedbackById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!feedback.getUser().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN)) {
                return "redirect:/feedback/list?error=unauthorized";
            }

            model.addAttribute("feedback", feedback);
            model.addAttribute("feedbackTypes", Feedback.FeedbackType.values());
            return "feedback/edit";
        } catch (Exception e) {
            return "redirect:/feedback/list?error=feedback-not-found";
        }
    }

    @PostMapping("/{id}/edit")
    public String updateFeedback(@PathVariable("id") Long id,
                                 @Valid @ModelAttribute("feedback") Feedback feedbackDetails,
                                 BindingResult result, Model model) {

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            model.addAttribute("feedbackTypes", Feedback.FeedbackType.values());
            return "feedback/edit";
        }

        try {
            // Lấy thông tin đánh giá
            Feedback feedback = feedbackService.getFeedbackById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!feedback.getUser().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN)) {
                return "redirect:/feedback/list?error=unauthorized";
            }

            // Cập nhật đánh giá
            feedbackService.updateFeedback(id, feedbackDetails);

            return "redirect:/feedback/list?updated";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
            model.addAttribute("feedbackTypes", Feedback.FeedbackType.values());
            return "feedback/edit";
        }
    }

    @GetMapping("/{id}/delete")
    public String deleteFeedback(@PathVariable("id") Long id) {
        try {
            // Lấy thông tin đánh giá
            Feedback feedback = feedbackService.getFeedbackById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!feedback.getUser().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN)) {
                return "redirect:/feedback/list?error=unauthorized";
            }

            // Xóa đánh giá
            feedbackService.deleteFeedback(id);

            return "redirect:/feedback/list?deleted";
        } catch (Exception e) {
            return "redirect:/feedback/list?error=delete-failed";
        }
    }

    @GetMapping("/admin/list")
    public String adminListFeedback(
            @RequestParam(name = "type", required = false) Feedback.FeedbackType type,
            Model model) {

        List<Feedback> feedbacks;

        if (type != null) {
            feedbacks = feedbackService.getFeedbacksByType(type);
            model.addAttribute("typeFilter", type);
        } else {
            feedbacks = feedbackService.getPublicFeedbacks();
        }

        // Lấy điểm đánh giá trung bình
        Double averageRating = feedbackService.getAverageRating();

        model.addAttribute("feedbacks", feedbacks);
        model.addAttribute("averageRating", averageRating);
        model.addAttribute("feedbackTypes", Feedback.FeedbackType.values());

        return "admin/feedback/list";
    }
}
