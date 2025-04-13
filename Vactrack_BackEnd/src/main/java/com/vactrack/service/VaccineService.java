package com.vactrack.service;

import com.vactrack.model.Vaccine;
import com.vactrack.repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VaccineService {

    private final VaccineRepository vaccineRepository;

    @Autowired
    public VaccineService(VaccineRepository vaccineRepository) {
        this.vaccineRepository = vaccineRepository;
    }

    public Page<Vaccine> findVaccines(int page, int size, String category, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return vaccineRepository.findWithFilters(category, search, pageable);
    }

    public Optional<Vaccine> findById(Long id) {
        return vaccineRepository.findById(id);
    }

    public Vaccine createVaccine(Vaccine vaccine) {
        return vaccineRepository.save(vaccine);
    }

    public Vaccine updateVaccine(Long id, Vaccine vaccineDetails) {
        Vaccine vaccine = vaccineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vaccine với ID: " + id));

        vaccine.setName(vaccineDetails.getName());
        vaccine.setManufacturer(vaccineDetails.getManufacturer());
        vaccine.setCategory(vaccineDetails.getCategory());
        vaccine.setAgeGroup(vaccineDetails.getAgeGroup());
        vaccine.setDosage(vaccineDetails.getDosage());
        vaccine.setPrice(vaccineDetails.getPrice());
        vaccine.setInStock(vaccineDetails.getInStock());
        vaccine.setExpiryDate(vaccineDetails.getExpiryDate());
        vaccine.setDescription(vaccineDetails.getDescription());
        vaccine.setImageUrl(vaccineDetails.getImageUrl());

        return vaccineRepository.save(vaccine);
    }

    public Vaccine updateStock(Long id, int quantity, String action) {
        Vaccine vaccine = vaccineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vaccine với ID: " + id));

        int currentStock = vaccine.getInStock();

        if ("add".equals(action)) {
            vaccine.setInStock(currentStock + quantity);
        } else if ("remove".equals(action)) {
            if (currentStock < quantity) {
                throw new RuntimeException("Số lượng tồn kho không đủ");
            }
            vaccine.setInStock(currentStock - quantity);
        } else {
            throw new RuntimeException("Hành động không hợp lệ");
        }

        return vaccineRepository.save(vaccine);
    }
}
