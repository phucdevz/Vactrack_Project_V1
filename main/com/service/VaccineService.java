package com.service;

import com.exception.ResourceNotFoundException;
//import com.model.Vaccine;
import com.exception.Vaccine;
import com.repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VaccineService {

    private final VaccineRepository vaccineRepository;

    @Autowired
    public VaccineService(VaccineRepository vaccineRepository) {
        this.vaccineRepository = vaccineRepository;
    }

    /**
     * Tạo vắc-xin mới
     */
    @Transactional
    public Vaccine createVaccine(Vaccine vaccine) {
        return vaccineRepository.save(vaccine);
    }

    /**
     * Lấy thông tin vắc-xin theo ID
     */
    public Vaccine getVaccineById(Long id) {
        return vaccineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine", "id", id));
    }

    /**
     * Lấy danh sách tất cả vắc-xin
     */
    public List<Vaccine> getAllVaccines() {
        return vaccineRepository.findAll();
    }

    /**
     * Lấy danh sách vắc-xin đang hoạt động
     */
    public List<Vaccine> getActiveVaccines() {
        return vaccineRepository.findByIsActiveTrue();
    }

    /**
     * Lấy danh sách vắc-xin theo độ tuổi
     */
    public List<Vaccine> getVaccinesByAgeRange(String ageRange) {
        return vaccineRepository.findByRecommendedAgeContaining(ageRange);
    }

    /**
     * Cập nhật thông tin vắc-xin
     */
    @Transactional
    public Vaccine updateVaccine(Long id, Vaccine vaccineDetails) {
        Vaccine vaccine = getVaccineById(id);

        vaccine.setName(vaccineDetails.getName());
        vaccine.setDescription(vaccineDetails.getDescription());
        vaccine.setRecommendedAge(vaccineDetails.getRecommendedAge());
        vaccine.setDosesRequired(vaccineDetails.getDosesRequired());
        vaccine.setDaysBetweenDoses(vaccineDetails.getDaysBetweenDoses());
        vaccine.setPrice(vaccineDetails.getPrice());
        vaccine.setManufacturer(vaccineDetails.getManufacturer());
        vaccine.setStorageTemperature(vaccineDetails.getStorageTemperature());

        return vaccineRepository.save(vaccine);
    }

    /**
     * Vô hiệu hóa vắc-xin
     */
    @Transactional
    public void deactivateVaccine(Long id) {
        Vaccine vaccine = getVaccineById(id);
        vaccine.setActive(false);
        vaccineRepository.save(vaccine);
    }

    /**
     * Kích hoạt vắc-xin
     */
    @Transactional
    public void activateVaccine(Long id) {
        Vaccine vaccine = getVaccineById(id);
        vaccine.setActive(true);
        vaccineRepository.save(vaccine);
    }

    /**
     * Xóa vắc-xin
     */
    @Transactional
    public void deleteVaccine(Long id) {
        // Kiểm tra vắc-xin tồn tại
        if (!vaccineRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vaccine", "id", id);
        }

        vaccineRepository.deleteById(id);
    }
}
