package com.vactrack.controller;

import com.vactrack.dto.ApiResponse;
import com.vactrack.dto.FeedbackListResponse;
import com.vactrack.dto.FeedbackRequest;
import com.vactrack.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    /**
     * Gửi phản hồi - công khai truy cập
     */
    @PostMapping
    public ResponseEntity<?> submitFeedback(@Valid @RequestBody FeedbackRequest request,
                                            BindingResult bindingResult) {
        // Xử lý lỗi validation
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.toList());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Lỗi kiểm tra dữ liệu", errors));
        }

        try {
            feedbackService.saveFeedback(request);
            return ResponseEntity.ok(new ApiResponse(true, "Đã gửi phản hồi thành công"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Lỗi máy chủ: " + e.getMessage()));
        }
    }

    /**
     * Lấy tất cả phản hồi - chỉ dành cho admin
     */
    @GetMapping
    public ResponseEntity<?> getAllFeedback(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String order) {

        try {
            FeedbackListResponse response = feedbackService.getAllFeedback(page, limit, sortBy, order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Lỗi máy chủ: " + e.getMessage()));
        }
    }

    /**
     * Lấy feedback công khai - không cần xác thực
     */
    @GetMapping("/public")
    public ResponseEntity<?> getPublicFeedback(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String order) {

        try {
            FeedbackListResponse response = feedbackService.getPublicFeedback(page, limit, sortBy, order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Lỗi máy chủ: " + e.getMessage()));
        }
    }
}
