package com.service;

import com.exception.ResourceNotFoundException;
import com.model.*;
import com.repository.ChildRepository;
import com.repository.VaccinationScheduleRepository;
import com.repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class VaccinationScheduleService {

    private final VaccinationScheduleRepository scheduleRepository;
    private final ChildRepository childRepository;
    private final VaccineRepository vaccineRepository;

    @Autowired
    public VaccinationScheduleService(
            VaccinationScheduleRepository scheduleRepository,
            ChildRepository childRepository,
            VaccineRepository vaccineRepository) {
        this.scheduleRepository = scheduleRepository;
        this.childRepository = childRepository;
        this.vaccineRepository = vaccineRepository;
    }

    /**
     * Tạo lịch tiêm chủng tiêu chuẩn cho trẻ em
     */
    @Transactional
    public VaccinationSchedule createStandardSchedule(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child", "id", childId));

        // Kiểm tra xem đã có lịch tiêm chưa
        if (scheduleRepository.findByChildId(childId).isPresent()) {
            throw new IllegalArgumentException("Vaccination schedule already exists for this child");
        }

        VaccinationSchedule schedule = new VaccinationSchedule();
        schedule.setChild(child);
        schedule.setType(VaccinationSchedule.ScheduleType.STANDARD);
        schedule = scheduleRepository.save(schedule);

        // Lấy danh sách vắc-xin đang hoạt động
        List<Vaccine> activeVaccines = vaccineRepository.findByIsActiveTrue();

        // Tính tuổi của trẻ
        LocalDate now = LocalDate.now();
        LocalDate birthDate = child.getBirthDate();
        int ageInMonths = Period.between(birthDate, now).getMonths() + Period.between(birthDate, now).getYears() * 12;

        Set<ScheduleItem> scheduleItems = new HashSet<>();

        // Tạo các mục lịch tiêm dựa trên độ tuổi và vắc-xin
        for (Vaccine vaccine : activeVaccines) {
            String recommendedAge = vaccine.getRecommendedAge();

            // Đơn giản hóa: giả sử recommendedAge có dạng "x-y months"
            if (recommendedAge != null && !recommendedAge.isEmpty()) {
                try {
                    // Phân tích chuỗi để lấy độ tuổi khuyến nghị
                    String[] parts = recommendedAge.split("-");
                    int minAge = Integer.parseInt(parts[0].trim());

                    // Tính ngày tiêm dựa trên độ tuổi
                    LocalDate recommendedDate;
                    if (ageInMonths < minAge) {
                        // Nếu trẻ chưa đến tuổi, tính ngày tiêm trong tương lai
                        recommendedDate = birthDate.plusMonths(minAge);
                    } else {
                        // Nếu trẻ đã qua tuổi, đặt ngày tiêm là hiện tại
                        recommendedDate = now;
                    }

                    // Tạo mục lịch tiêm cho liều đầu tiên
                    ScheduleItem item = new ScheduleItem();
                    item.setSchedule(schedule);
                    item.setVaccine(vaccine);
                    item.setRecommendedDate(recommendedDate);
                    item.setDoseNumber(1);
                    item.setStatus(ScheduleItem.Status.PENDING);
                    scheduleItems.add(item);

                    // Tạo mục lịch tiêm cho các liều tiếp theo (nếu có)
                    if (vaccine.getDosesRequired() != null && vaccine.getDosesRequired() > 1 && vaccine.getDaysBetweenDoses() != null) {
                        for (int dose = 2; dose <= vaccine.getDosesRequired(); dose++) {
                            ScheduleItem nextDoseItem = new ScheduleItem();
                            nextDoseItem.setSchedule(schedule);
                            nextDoseItem.setVaccine(vaccine);
                            nextDoseItem.setRecommendedDate(recommendedDate.plusDays(vaccine.getDaysBetweenDoses() * (dose - 1)));
                            nextDoseItem.setDoseNumber(dose);
                            nextDoseItem.setStatus(ScheduleItem.Status.PENDING);
                            scheduleItems.add(nextDoseItem);
                        }
                    }
                } catch (Exception e) {
                    // Xử lý ngoại lệ khi phân tích chuỗi
                    continue;
                }
            }
        }

        schedule.setScheduleItems(scheduleItems);
        return scheduleRepository.save(schedule);
    }

    /**
     * Lấy lịch tiêm chủng của trẻ em
     */
    public VaccinationSchedule getScheduleByChildId(Long childId) {
        return scheduleRepository.findByChildId(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccination Schedule", "childId", childId));
    }

    /**
     * Cập nhật trạng thái mục lịch tiêm
     */
    @Transactional
    public ScheduleItem updateScheduleItemStatus(Long itemId, ScheduleItem.Status status) {
        // Giả sử bạn có repository cho ScheduleItem
        // ScheduleItemRepository scheduleItemRepository;

        // ScheduleItem item = scheduleItemRepository.findById(itemId)
        //        .orElseThrow(() -> new ResourceNotFoundException("Schedule Item", "id", itemId));

        // item.setStatus(status);
        // return scheduleItemRepository.save(item);

        // Vì chưa có ScheduleItemRepository, tạm thời trả về null
        return null;
    }

    /**
     * Tùy chỉnh lịch tiêm chủng
     */
    @Transactional
    public VaccinationSchedule customizeSchedule(Long scheduleId, Set<ScheduleItem> customItems) {
        VaccinationSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccination Schedule", "id", scheduleId));

        schedule.setType(VaccinationSchedule.ScheduleType.CUSTOM);

        // Xóa các mục lịch tiêm cũ
        schedule.getScheduleItems().clear();

        // Thêm các mục lịch tiêm mới
        for (ScheduleItem item : customItems) {
            item.setSchedule(schedule);
        }
        schedule.getScheduleItems().addAll(customItems);

        return scheduleRepository.save(schedule);
    }

    /**
     * Xóa lịch tiêm chủng
     */
    @Transactional
    public void deleteSchedule(Long scheduleId) {
        if (!scheduleRepository.existsById(scheduleId)) {
            throw new ResourceNotFoundException("Vaccination Schedule", "id", scheduleId);
        }

        scheduleRepository.deleteById(scheduleId);
    }
}
