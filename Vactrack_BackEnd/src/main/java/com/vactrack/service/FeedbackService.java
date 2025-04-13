package com.vactrack.service;

import com.vactrack.dto.FeedbackListResponse;
import com.vactrack.dto.FeedbackRequest;
import com.vactrack.dto.FeedbackResponse;
import com.vactrack.model.Feedback;
import com.vactrack.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    /**
     * Lưu phản hồi mới
     */
    public Feedback saveFeedback(FeedbackRequest request) {
        Feedback feedback = new Feedback();
        feedback.setName(request.getName());
        feedback.setEmail(request.getEmail());
        feedback.setSubject(request.getSubject());
        feedback.setMessage(request.getMessage());
        feedback.setRating(request.getRating());

        // Thêm dòng này
        feedback.setPublished(request.getPublished() != null ? request.getPublished() : false);

        // Sử dụng thời gian được cung cấp hoặc thời gian hiện tại
        feedback.setCreatedAt(request.getCreatedAt() != null ?
                request.getCreatedAt() :
                LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }

    /**
     * Lấy tất cả phản hồi với phân trang và sắp xếp
     */
    public FeedbackListResponse getAllFeedback(int page, int limit, String sortBy, String order) {
        // Chuyển đổi sang chỉ mục trang 0-based cho Spring
        page = Math.max(0, page - 1);
        limit = limit <= 0 ? 10 : limit;
        sortBy = sortBy == null || sortBy.isEmpty() ? "createdAt" : sortBy;

        // Tạo hướng sắp xếp
        Sort.Direction direction = "asc".equalsIgnoreCase(order) ?
                Sort.Direction.ASC :
                Sort.Direction.DESC;

        // Tạo đối tượng phân trang
        Pageable pageable = PageRequest.of(page, limit, Sort.by(direction, sortBy));

        // Lấy trang phản hồi
        Page<Feedback> feedbackPage = feedbackRepository.findAll(pageable);

        // Chuyển đổi sang DTO
        List<FeedbackResponse> feedbackResponses = feedbackPage.getContent()
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());

        // Tạo thông tin phân trang
        FeedbackListResponse.PaginationInfo paginationInfo = new FeedbackListResponse.PaginationInfo(
                (int) feedbackPage.getTotalElements(),
                feedbackPage.getTotalPages(),
                feedbackPage.getNumber() + 1, // Chuyển lại sang 1-based cho API
                feedbackPage.getSize()
        );

        // Tạo và trả về phản hồi cuối cùng
        return new FeedbackListResponse(true, feedbackResponses, paginationInfo);
    }

    /**
     * Chuyển đổi entity Feedback sang DTO FeedbackResponse
     */
    private FeedbackResponse convertToResponseDto(Feedback feedback) {
        FeedbackResponse response = new FeedbackResponse();
        response.setId(feedback.getId());
        response.setName(feedback.getName());
        response.setEmail(feedback.getEmail());
        response.setSubject(feedback.getSubject());
        response.setMessage(feedback.getMessage());
        response.setRating(feedback.getRating());
        response.setCreatedAt(feedback.getCreatedAt().format(formatter));
        return response;
    }

    /**
     * Lấy feedback công khai với phân trang và sắp xếp
     */
    public FeedbackListResponse getPublicFeedback(int page, int limit, String sortBy, String order) {
        // Chuyển đổi sang chỉ mục trang 0-based cho Spring
        page = Math.max(0, page - 1);
        limit = limit <= 0 ? 10 : limit;
        sortBy = sortBy == null || sortBy.isEmpty() ? "createdAt" : sortBy;

        // Tạo hướng sắp xếp
        Sort.Direction direction = "asc".equalsIgnoreCase(order) ?
                Sort.Direction.ASC :
                Sort.Direction.DESC;

        // Tạo đối tượng phân trang
        Pageable pageable = PageRequest.of(page, limit, Sort.by(direction, sortBy));

        // Tìm kiếm các feedback được published = true
        Page<Feedback> feedbackPage = feedbackRepository.findByPublishedTrueAndRatingGreaterThanEqual(4, pageable);

        // Chuyển đổi sang DTO
        List<FeedbackResponse> feedbackResponses = feedbackPage.getContent()
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());

        // Tạo thông tin phân trang
        FeedbackListResponse.PaginationInfo paginationInfo = new FeedbackListResponse.PaginationInfo(
                (int) feedbackPage.getTotalElements(),
                feedbackPage.getTotalPages(),
                feedbackPage.getNumber() + 1, // Chuyển lại sang 1-based cho API
                feedbackPage.getSize()
        );

        // Tạo và trả về phản hồi cuối cùng
        return new FeedbackListResponse(true, feedbackResponses, paginationInfo);
    }
}
