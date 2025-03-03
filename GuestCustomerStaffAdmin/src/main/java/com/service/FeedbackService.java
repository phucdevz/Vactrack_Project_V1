package main.java.com.service;

import main.java.com.exception.ResourceNotFoundException;
import main.java.com.model.Feedback;
import main.java.com.model.User;
import main.java.com.repository.FeedbackRepository;
import main.java.com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    @Autowired
    public FeedbackService(
            FeedbackRepository feedbackRepository,
            UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    /**
     * Tạo đánh giá mới
     */
    @Transactional
    public Feedback createFeedback(Feedback feedback, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        feedback.setUser(user);

        return feedbackRepository.save(feedback);
    }

    /**
     * Lấy thông tin đánh giá theo ID
     */
    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback", "id", id));
    }

    /**
     * Lấy danh sách đánh giá của người dùng
     */
    public List<Feedback> getFeedbacksByUserId(Long userId) {
        return feedbackRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Lấy danh sách đánh giá công khai
     */
    public List<Feedback> getPublicFeedbacks() {
        return feedbackRepository.findByIsPublicTrueOrderByCreatedAtDesc();
    }

    /**
     * Lấy danh sách đánh giá theo loại
     */
    public List<Feedback> getFeedbacksByType(Feedback.FeedbackType type) {
        return feedbackRepository.findByType(type);
    }

    /**
     * Lấy điểm đánh giá trung bình
     */
    public Double getAverageRating() {
        return feedbackRepository.getAverageRating();
    }

    /**
     * Lấy điểm đánh giá trung bình theo loại
     */
    public Double getAverageRatingByType(Feedback.FeedbackType type) {
        return feedbackRepository.getAverageRatingByType(type);
    }

    /**
     * Cập nhật thông tin đánh giá
     */
    @Transactional
    public Feedback updateFeedback(Long id, Feedback feedbackDetails) {
        Feedback feedback = getFeedbackById(id);

        feedback.setRating(feedbackDetails.getRating());
        feedback.setComment(feedbackDetails.getComment());
        feedback.setPublic(feedbackDetails.isPublic());

        return feedbackRepository.save(feedback);
    }

    /**
     * Xóa đánh giá
     */
    @Transactional
    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new ResourceNotFoundException("Feedback", "id", id);
        }

        feedbackRepository.deleteById(id);
    }
}
