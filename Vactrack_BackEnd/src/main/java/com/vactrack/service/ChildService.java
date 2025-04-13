package com.vactrack.service;

import com.vactrack.dto.ChildRequest;
import com.vactrack.dto.ChildResponse;
import com.vactrack.exception.ApiException;
import com.vactrack.model.Child;
import com.vactrack.repository.ChildRepository;
import com.vactrack.repository.UserRepository;
import com.vactrack.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChildService {

    private final ChildRepository childRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    @Autowired
    public ChildService(ChildRepository childRepository, UserRepository userRepository, SecurityUtils securityUtils) {
        this.childRepository = childRepository;
        this.userRepository = userRepository;
        this.securityUtils = securityUtils;
    }

    /**
     * Lấy danh sách tất cả trẻ em của người dùng hiện tại
     */
    public List<ChildResponse> getAllChildren() {
        Long currentUserId = securityUtils.getCurrentUserId();

        return childRepository.findByUserId(currentUserId).stream()
                .map(this::mapToChildResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin trẻ em theo ID (chỉ trẻ em của người dùng hiện tại)
     */
    public ChildResponse getChildById(Long id) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Child child = childRepository.findByIdAndUserId(id, currentUserId)
                .orElseThrow(() -> new ApiException("Child not found with id: " + id, HttpStatus.NOT_FOUND));

        return mapToChildResponse(child);
    }

    /**
     * Tạo mới thông tin trẻ em cho người dùng hiện tại
     */
    @Transactional
    public ChildResponse createChild(ChildRequest childRequest) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Child child = new Child();
        child.setName(childRequest.getName());
        child.setDob(childRequest.getDob());
        child.setGender(childRequest.getGender());
        child.setBloodType(childRequest.getBloodType());
        child.setAllergies(childRequest.getAllergies());
        child.setNotes(childRequest.getNotes());
        child.setUserId(currentUserId);

        Child savedChild = childRepository.save(child);
        return mapToChildResponse(savedChild);
    }

    /**
     * Cập nhật thông tin trẻ em (chỉ trẻ em của người dùng hiện tại)
     */
    @Transactional
    public ChildResponse updateChild(Long id, ChildRequest childRequest) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Child child = childRepository.findByIdAndUserId(id, currentUserId)
                .orElseThrow(() -> new ApiException("Child not found with id: " + id, HttpStatus.NOT_FOUND));

        child.setName(childRequest.getName());
        child.setDob(childRequest.getDob());
        child.setGender(childRequest.getGender());
        child.setBloodType(childRequest.getBloodType());
        child.setAllergies(childRequest.getAllergies());
        child.setNotes(childRequest.getNotes());

        Child updatedChild = childRepository.save(child);
        return mapToChildResponse(updatedChild);
    }

    /**
     * Xóa thông tin trẻ em (chỉ trẻ em của người dùng hiện tại)
     */
    @Transactional
    public void deleteChild(Long id) {
        Long currentUserId = securityUtils.getCurrentUserId();

        if (!childRepository.existsByIdAndUserId(id, currentUserId)) {
            throw new ApiException("Child not found with id: " + id, HttpStatus.NOT_FOUND);
        }

        childRepository.deleteById(id);
    }

    /**
     * Chuyển đổi từ Child entity sang ChildResponse DTO
     */
    private ChildResponse mapToChildResponse(Child child) {
        return new ChildResponse(
                child.getId(),
                child.getName(),
                child.getDob(),
                child.getGender(),
                child.getBloodType(),
                child.getAllergies(),
                child.getNotes()
        );
    }
}