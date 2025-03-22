package com.service;

import com.exception.ResourceNotFoundException;
import com.model.Child;
import com.model.User;
import com.repository.ChildRepository;
import com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChildService {

    private final ChildRepository childRepository;
    private final UserRepository userRepository;

    @Autowired
    public ChildService(ChildRepository childRepository, UserRepository userRepository) {
        this.childRepository = childRepository;
        this.userRepository = userRepository;
    }

    /**
     * Tạo hồ sơ trẻ em mới
     */
    @Transactional
    public Child createChild(Child child, Long parentId) {
        User parent = userRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", parentId));

        child.setParent(parent);
        return childRepository.save(child);
    }

    /**
     * Lấy thông tin trẻ em theo ID
     */
    public Child getChildById(Long id) {
        return childRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Child", "id", id));
    }

    /**
     * Lấy danh sách trẻ em của một phụ huynh
     */
    public List<Child> getChildrenByParentId(Long parentId) {
        return childRepository.findByParentId(parentId);
    }

    /**
     * Cập nhật thông tin trẻ em
     */
    @Transactional
    public Child updateChild(Long id, Child childDetails) {
        Child child = getChildById(id);

        child.setName(childDetails.getName());
        child.setBirthDate(childDetails.getBirthDate());
        child.setGender(childDetails.getGender());
        child.setMedicalHistory(childDetails.getMedicalHistory());
        child.setAllergies(childDetails.getAllergies());

        return childRepository.save(child);
    }

    /**
     * Xóa hồ sơ trẻ em
     */
    @Transactional
    public void deleteChild(Long id) {
        // Kiểm tra trẻ em tồn tại
        if (!childRepository.existsById(id)) {
            throw new ResourceNotFoundException("Child", "id", id);
        }

        childRepository.deleteById(id);
    }

    /**
     * Lấy danh sách tất cả trẻ em (chỉ dành cho Admin)
     */
    public List<Child> getAllChildren() {
        return childRepository.findAll();
    }
}
