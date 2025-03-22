package com.controller;

import main.java.com.dto.VaccinationRecordDTO;
import main.java.com.model.Child;
import main.java.com.model.User;
import main.java.com.model.VaccinationRecord;
import main.java.com.service.ChildService;
import main.java.com.service.UserService;
import main.java.com.service.VaccinationRecordService;
import main.java.com.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/records")
public class VaccinationRecordController {

    private final VaccinationRecordService recordService;
    private final ChildService childService;
    private final UserService userService;
    private final VaccineService vaccineService;

    @Autowired
    public VaccinationRecordController(
            VaccinationRecordService recordService,
            ChildService childService,
            UserService userService,
            VaccineService vaccineService) {
        this.recordService = recordService;
        this.childService = childService;
        this.userService = userService;
        this.vaccineService = vaccineService;
    }

    @GetMapping("/child/{childId}")
    public String listRecords(@PathVariable("childId") Long childId, Model model) {
        try {
            // Lấy thông tin trẻ em
            Child child = childService.getChildById(childId);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!child.getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/children?error=unauthorized";
            }

            // Lấy danh sách bản ghi tiêm chủng
            List<VaccinationRecord> records = recordService.getVaccinationRecordsByChildId(childId);
            List<VaccinationRecordDTO> recordDTOs = records.stream()
                    .map(VaccinationRecordDTO::new)
                    .collect(Collectors.toList());

            model.addAttribute("child", child);
            model.addAttribute("records", recordDTOs);

            return "records/list";
        } catch (Exception e) {
            return "redirect:/children?error=child-not-found";
        }
    }

    @GetMapping("/child/{childId}/add")
    public String showAddRecordForm(@PathVariable("childId") Long childId, Model model) {
        try {
            // Lấy thông tin trẻ em
            Child child = childService.getChildById(childId);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/children?error=unauthorized";
            }

            VaccinationRecordDTO recordDTO = new VaccinationRecordDTO();
            recordDTO.setChildId(childId);
            recordDTO.setChildName(child.getName());

            model.addAttribute("record", recordDTO);
            model.addAttribute("child", child);
            model.addAttribute("vaccines", vaccineService.getActiveVaccines());

            return "records/add";
        } catch (Exception e) {
            return "redirect:/children?error=child-not-found";
        }
    }

    @PostMapping("/child/{childId}/add")
    public String addRecord(@PathVariable("childId") Long childId,
                            @Valid @ModelAttribute("record") VaccinationRecordDTO recordDTO,
                            BindingResult result, Model model) {

        // Kiểm tra quyền truy cập
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        if (!user.getRole().equals(User.Role.ADMIN) &&
                !user.getRole().equals(User.Role.STAFF)) {
            return "redirect:/children?error=unauthorized";
        }

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            try {
                Child child = childService.getChildById(childId);
                model.addAttribute("child", child);
                model.addAttribute("vaccines", vaccineService.getActiveVaccines());
                return "records/add";
            } catch (Exception e) {
                return "redirect:/children?error=child-not-found";
            }
        }

        try {
            // Tạo đối tượng VaccinationRecord từ DTO
            VaccinationRecord record = new VaccinationRecord();
            record.setVaccinationDate(recordDTO.getVaccinationDate());
            record.setDoseNumber(recordDTO.getDoseNumber());
            record.setBatchNumber(recordDTO.getBatchNumber());
            record.setAdministeredBy(recordDTO.getAdministeredBy());
            record.setNextDoseDate(recordDTO.getNextDoseDate());
            record.setNotes(recordDTO.getNotes());

            // Thêm bản ghi tiêm chủng
            recordService.createVaccinationRecord(record, childId, recordDTO.getVaccineId());

            return "redirect:/records/child/" + childId + "?created";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());

            try {
                Child child = childService.getChildById(childId);
                model.addAttribute("child", child);
                model.addAttribute("vaccines", vaccineService.getActiveVaccines());
                return "records/add";
            } catch (Exception ex) {
                return "redirect:/children?error=child-not-found";
            }
        }
    }

    @GetMapping("/{id}")
    public String viewRecord(@PathVariable("id") Long id, Model model) {
        try {
            // Lấy thông tin bản ghi tiêm chủng
            VaccinationRecord record = recordService.getVaccinationRecordById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!record.getChild().getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/children?error=unauthorized";
            }

            model.addAttribute("record", new VaccinationRecordDTO(record));
            return "records/view";
        } catch (Exception e) {
            return "redirect:/children?error=record-not-found";
        }
    }

    @GetMapping("/{id}/edit")
    public String showEditRecordForm(@PathVariable("id") Long id, Model model) {
        try {
            // Lấy thông tin bản ghi tiêm chủng
            VaccinationRecord record = recordService.getVaccinationRecordById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/children?error=unauthorized";
            }

            model.addAttribute("record", new VaccinationRecordDTO(record));
            model.addAttribute("vaccines", vaccineService.getActiveVaccines());

            return "records/edit";
        } catch (Exception e) {
            return "redirect:/children?error=record-not-found";
        }
    }

    @PostMapping("/{id}/edit")
    public String updateRecord(@PathVariable("id") Long id,
                               @Valid @ModelAttribute("record") VaccinationRecordDTO recordDTO,
                               BindingResult result, Model model) {

        // Kiểm tra quyền truy cập
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(auth.getName());

        if (!user.getRole().equals(User.Role.ADMIN) &&
                !user.getRole().equals(User.Role.STAFF)) {
            return "redirect:/children?error=unauthorized";
        }

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            model.addAttribute("vaccines", vaccineService.getActiveVaccines());
            return "records/edit";
        }

        try {
            // Tạo đối tượng VaccinationRecord từ DTO
            VaccinationRecord record = new VaccinationRecord();
            record.setId(id);
            record.setVaccinationDate(recordDTO.getVaccinationDate());
            record.setDoseNumber(recordDTO.getDoseNumber());
            record.setBatchNumber(recordDTO.getBatchNumber());
            record.setAdministeredBy(recordDTO.getAdministeredBy());
            record.setNextDoseDate(recordDTO.getNextDoseDate());
            record.setNotes(recordDTO.getNotes());

            // Cập nhật bản ghi tiêm chủng
            recordService.updateVaccinationRecord(id, record);

            return "redirect:/records/" + id + "?updated";
        } catch (Exception e) {
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
            model.addAttribute("vaccines", vaccineService.getActiveVaccines());
            return "records/edit";
        }
    }

    @GetMapping("/{id}/reaction")
    public String showReactionForm(@PathVariable("id") Long id, Model model) {
        try {
            // Lấy thông tin bản ghi tiêm chủng
            VaccinationRecord record = recordService.getVaccinationRecordById(id);

            // Kiểm tra quyền truy cập
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByUsername(auth.getName());

            if (!record.getChild().getParent().getId().equals(user.getId()) &&
                    !user.getRole().equals(User.Role.ADMIN) &&
                    !user.getRole().equals(User.Role.STAFF)) {
                return "redirect:/children?error=unauthorized";
            }

            model.addAttribute("record", new VaccinationRecordDTO(record));
            // model.addAttribute("reaction", new VaccinationReactionDTO());

            return "records/reaction";
        } catch (Exception e) {
            return "redirect:/children?error=record-not-found";
        }
    }

    // Phương thức POST để xử lý form ghi nhận phản ứng
    // @PostMapping("/{id}/reaction")
    // public String recordReaction(...) { ... }
}
