package com.vactrack.controller;

import com.vactrack.service.SystemSettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
@PreAuthorize("hasAuthority('ADMIN')")
@CrossOrigin(origins = "*")
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    @Autowired
    public SystemSettingController(SystemSettingService systemSettingService) {
        this.systemSettingService = systemSettingService;
    }

    @GetMapping
    public ResponseEntity<?> getSystemSettings() {
        Map<String, Object> settings = systemSettingService.getSettings();
        return ResponseEntity.ok(settings);
    }

    @PutMapping
    public ResponseEntity<?> updateSystemSettings(@RequestBody Map<String, Object> settings) {
        try {
            Map<String, Object> updatedSettings = systemSettingService.updateSettings(settings);
            return ResponseEntity.ok(updatedSettings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
