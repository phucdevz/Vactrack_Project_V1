package main.java.com.service;

import main.java.com.exception.ResourceNotFoundException;
import main.java.com.model.*;
import main.java.com.repository.ChildRepository;
import main.java.com.repository.VaccinationRecordRepository;
import main.java.com.repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VaccinationRecordService {

    private final VaccinationRecordRepository recordRepository;
    private final ChildRepository childRepository;
    private final VaccineRepository vaccineRepository;

    @Autowired
    public VaccinationRecordService(
            VaccinationRecordRepository recordRepository,
            ChildRepository childRepository,
            VaccineRepository vaccineRepository) {
        this.recordRepository = recordRepository;
        this.childRepository = childRepository;
        this.vaccineRepository = vaccineRepository;
    }

    /**
     * Tạo bản ghi tiêm chủng mới
     */
    @Transactional
    public VaccinationRecord createVaccinationRecord(VaccinationRecord record, Long childId, Long vaccineId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child", "id", childId));

        Vaccine vaccine = vaccineRepository.findById(vaccineId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine", "id", vaccineId));

        // Kiểm tra xem có bản ghi tiêm chủng nào cho vaccine và dose này chưa
        Optional<VaccinationRecord> existingRecord = recordRepository
                .findByChildAndVaccineAndDoseNumber(child, vaccine, record.getDoseNumber());

        if (existingRecord.isPresent()) {
            throw new IllegalStateException("Vaccination record already exists for this child, vaccine and dose number");
        }

        record.setChild(child);
        record.setVaccine(vaccine);

        // Tính ngày tiêm liều tiếp theo nếu cần
        if (vaccine.getDosesRequired() != null &&
                record.getDoseNumber() < vaccine.getDosesRequired() &&
                vaccine.getDaysBetweenDoses() != null) {

            LocalDate nextDoseDate = record.getVaccinationDate().plusDays(vaccine.getDaysBetweenDoses());
            record.setNextDoseDate(nextDoseDate);
        }

        return recordRepository.save(record);
    }

    /**
     * Lấy thông tin bản ghi tiêm chủng theo ID
     */
    public VaccinationRecord getVaccinationRecordById(Long id) {
        return recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccination Record", "id", id));
    }

    /**
     * Lấy danh sách bản ghi tiêm chủng của một trẻ em
     */
    public List<VaccinationRecord> getVaccinationRecordsByChildId(Long childId) {
        return recordRepository.findByChildId(childId);
    }

    /**
     * Lấy danh sách bản ghi tiêm chủng theo vắc-xin
     */
    public List<VaccinationRecord> getVaccinationRecordsByVaccine(Long vaccineId) {
        Vaccine vaccine = vaccineRepository.findById(vaccineId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine", "id", vaccineId));

        return recordRepository.findByVaccine(vaccine);
    }

    /**
     * Lấy danh sách bản ghi tiêm chủng trong khoảng thời gian
     */
    public List<VaccinationRecord> getVaccinationRecordsBetweenDates(LocalDate startDate, LocalDate endDate) {
        return recordRepository.findByVaccinationDateBetween(startDate, endDate);
    }

    /**
     * Cập nhật thông tin bản ghi tiêm chủng
     */
    @Transactional
    public VaccinationRecord updateVaccinationRecord(Long id, VaccinationRecord recordDetails) {
        VaccinationRecord record = getVaccinationRecordById(id);

        record.setVaccinationDate(recordDetails.getVaccinationDate());
        record.setDoseNumber(recordDetails.getDoseNumber());
        record.setBatchNumber(recordDetails.getBatchNumber());
        record.setAdministeredBy(recordDetails.getAdministeredBy());
        record.setNextDoseDate(recordDetails.getNextDoseDate());
        record.setNotes(recordDetails.getNotes());

        return recordRepository.save(record);
    }

    /**
     * Xóa bản ghi tiêm chủng
     */
    @Transactional
    public void deleteVaccinationRecord(Long id) {
        if (!recordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vaccination Record", "id", id);
        }

        recordRepository.deleteById(id);
    }

    /**
     * Ghi nhận phản ứng sau tiêm
     */
    @Transactional
    public VaccinationReaction recordVaccinationReaction(VaccinationReaction reaction, Long recordId) {
        VaccinationRecord record = getVaccinationRecordById(recordId);
        reaction.setVaccinationRecord(record);

        // Giả sử có một repository cho VaccinationReaction
        // return reactionRepository.save(reaction);

        // Vì chưa có repository, tạm thời trả về null
        return null;
    }
}
