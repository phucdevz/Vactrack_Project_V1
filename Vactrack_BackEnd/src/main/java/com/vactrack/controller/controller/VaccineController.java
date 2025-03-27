package com.vactrack.controller;

import com.vactrack.model.Vaccine;
import com.vactrack.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/vaccines")
@PreAuthorize("hasAuthority('ADMIN')")
@CrossOrigin(origins = "*")
public class VaccineController {

    private final VaccineService vaccineService;

    @Autowired
    public VaccineController(VaccineService vaccineService) {
        this.vaccineService = vaccineService;
    }

    @GetMapping
    public ResponseEntity<?> getAllVaccines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        Page<Vaccine> vaccinePage = vaccineService.findVaccines(page, size, category, search);

        Map<String, Object> response = new HashMap<>();
        response.put("content", vaccinePage.getContent());
        response.put("totalElements", vaccinePage.getTotalElements());
        response.put("totalPages", vaccinePage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVaccineById(@PathVariable Long id) {
        return vaccineService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createVaccine(@RequestBody Vaccine vaccine) {
        try {
            Vaccine newVaccine = vaccineService.createVaccine(vaccine);
            return ResponseEntity.status(HttpStatus.CREATED).body(newVaccine);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVaccine(@PathVariable Long id, @RequestBody Vaccine vaccine) {
        try {
            Vaccine updatedVaccine = vaccineService.updateVaccine(id, vaccine);
            return ResponseEntity.ok(updatedVaccine);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<?> updateVaccineStock(
            @PathVariable Long id,
            @RequestBody Map<String, Object> stockUpdate) {

        try {
            Integer quantity = Integer.valueOf(stockUpdate.get("quantity").toString());
            String action = (String) stockUpdate.get("action");

            Vaccine updatedVaccine = vaccineService.updateStock(id, quantity, action);
            return ResponseEntity.ok(updatedVaccine);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
