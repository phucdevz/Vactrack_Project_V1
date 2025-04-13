package com.vactrack.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vactrack.model.SystemSetting;
import com.vactrack.repository.SystemSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SystemSettingService {

    private final SystemSettingRepository systemSettingRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public SystemSettingService(SystemSettingRepository systemSettingRepository, ObjectMapper objectMapper) {
        this.systemSettingRepository = systemSettingRepository;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> getSettings() {
        Map<String, Object> settings = new HashMap<>();

        // Lấy cài đặt giờ làm việc
        Map<String, Object> workingHours = getWorkingHours();
        settings.put("workingHours", workingHours);

        // Lấy cài đặt thông báo
        Map<String, Object> notifications = getNotificationSettings();
        settings.put("notifications", notifications);

        // Lấy gói dịch vụ
        List<Map<String, Object>> servicePackages = getServicePackages();
        settings.put("servicePackages", servicePackages);

        return settings;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getWorkingHours() {
        SystemSetting setting = systemSettingRepository.findById("workingHours")
                .orElse(createDefaultWorkingHours());

        try {
            return objectMapper.readValue(setting.getValue(), Map.class);
        } catch (JsonProcessingException e) {
            return createDefaultWorkingHoursMap();
        }
    }

    private SystemSetting createDefaultWorkingHours() {
        SystemSetting setting = new SystemSetting();
        setting.setKey("workingHours");

        Map<String, Object> defaultWorkingHours = createDefaultWorkingHoursMap();

        try {
            setting.setValue(objectMapper.writeValueAsString(defaultWorkingHours));
        } catch (JsonProcessingException e) {
            setting.setValue("{}");
        }

        return systemSettingRepository.save(setting);
    }

    private Map<String, Object> createDefaultWorkingHoursMap() {
        Map<String, Object> workingHours = new HashMap<>();

        String[] days = {"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"};
        for (String day : days) {
            Map<String, Object> daySettings = new HashMap<>();
            daySettings.put("start", "08:00");
            daySettings.put("end", "17:00");
            daySettings.put("closed", "sunday".equals(day));

            workingHours.put(day, daySettings);
        }

        return workingHours;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getNotificationSettings() {
        SystemSetting setting = systemSettingRepository.findById("notifications")
                .orElse(createDefaultNotifications());

        try {
            return objectMapper.readValue(setting.getValue(), Map.class);
        } catch (JsonProcessingException e) {
            return createDefaultNotificationsMap();
        }
    }

    private SystemSetting createDefaultNotifications() {
        SystemSetting setting = new SystemSetting();
        setting.setKey("notifications");

        Map<String, Object> defaultNotifications = createDefaultNotificationsMap();

        try {
            setting.setValue(objectMapper.writeValueAsString(defaultNotifications));
        } catch (JsonProcessingException e) {
            setting.setValue("{}");
        }

        return systemSettingRepository.save(setting);
    }

    private Map<String, Object> createDefaultNotificationsMap() {
        Map<String, Object> notifications = new HashMap<>();
        notifications.put("emailEnabled", true);
        notifications.put("smsEnabled", false);
        notifications.put("reminderHours", 24);

        return notifications;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> getServicePackages() {
        SystemSetting setting = systemSettingRepository.findById("servicePackages")
                .orElse(createDefaultServicePackages());

        try {
            return objectMapper.readValue(setting.getValue(), List.class);
        } catch (JsonProcessingException e) {
            return createDefaultServicePackagesList();
        }
    }

    private SystemSetting createDefaultServicePackages() {
        SystemSetting setting = new SystemSetting();
        setting.setKey("servicePackages");

        List<Map<String, Object>> defaultPackages = createDefaultServicePackagesList();

        try {
            setting.setValue(objectMapper.writeValueAsString(defaultPackages));
        } catch (JsonProcessingException e) {
            setting.setValue("[]");
        }

        return systemSettingRepository.save(setting);
    }

    private List<Map<String, Object>> createDefaultServicePackagesList() {
        List<Map<String, Object>> packages = new java.util.ArrayList<>();

        String[][] packageData = {
                {"1", "Gói cơ bản", "Gói tiêm chủng cơ bản", "1000000", "true"},
                {"2", "Gói nâng cao", "Gói tiêm chủng nâng cao", "2000000", "true"},
                {"3", "Gói đầy đủ", "Gói tiêm chủng đầy đủ", "3000000", "true"}
        };

        for (String[] data : packageData) {
            Map<String, Object> pkg = new HashMap<>();
            pkg.put("id", data[0]);
            pkg.put("name", data[1]);
            pkg.put("description", data[2]);
            pkg.put("price", Double.parseDouble(data[3]));
            pkg.put("active", Boolean.parseBoolean(data[4]));

            packages.add(pkg);
        }

        return packages;
    }

    public Map<String, Object> updateSettings(Map<String, Object> updatedSettings) {
        // Cập nhật giờ làm việc
        if (updatedSettings.containsKey("workingHours")) {
            updateWorkingHours((Map<String, Object>) updatedSettings.get("workingHours"));
        }

        // Cập nhật cài đặt thông báo
        if (updatedSettings.containsKey("notifications")) {
            updateNotifications((Map<String, Object>) updatedSettings.get("notifications"));
        }

        // Cập nhật gói dịch vụ
        if (updatedSettings.containsKey("servicePackages")) {
            updateServicePackages((List<Map<String, Object>>) updatedSettings.get("servicePackages"));
        }

        return getSettings();
    }

    private void updateWorkingHours(Map<String, Object> workingHours) {
        SystemSetting setting = systemSettingRepository.findById("workingHours")
                .orElse(new SystemSetting());

        setting.setKey("workingHours");

        try {
            setting.setValue(objectMapper.writeValueAsString(workingHours));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi khi cập nhật giờ làm việc", e);
        }

        systemSettingRepository.save(setting);
    }

    private void updateNotifications(Map<String, Object> notifications) {
        SystemSetting setting = systemSettingRepository.findById("notifications")
                .orElse(new SystemSetting());

        setting.setKey("notifications");

        try {
            setting.setValue(objectMapper.writeValueAsString(notifications));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi khi cập nhật cài đặt thông báo", e);
        }

        systemSettingRepository.save(setting);
    }

    private void updateServicePackages(List<Map<String, Object>> servicePackages) {
        SystemSetting setting = systemSettingRepository.findById("servicePackages")
                .orElse(new SystemSetting());

        setting.setKey("servicePackages");

        try {
            setting.setValue(objectMapper.writeValueAsString(servicePackages));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi khi cập nhật gói dịch vụ", e);
        }

        systemSettingRepository.save(setting);
    }
}
