package com.vactrack.service;

import com.vactrack.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class VaccinationService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public VaccinationService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public List<Map<String, Object>> getMonthlyData() {
        List<Map<String, Object>> monthlyData = new ArrayList<>();

        // Giả lập dữ liệu cho 12 tháng
        String[] months = {"January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"};

        for (String month : months) {
            Map<String, Object> data = new HashMap<>();
            data.put("month", month);
            data.put("count", (int) (Math.random() * 100)); // Random data for demonstration
            monthlyData.add(data);
        }

        return monthlyData;
    }

    public List<Map<String, Object>> getDistributionByService() {
        List<Map<String, Object>> distribution = new ArrayList<>();

        // Giả lập phân phối theo loại dịch vụ
        String[] services = {"BCG Vaccine", "Polio Vaccine", "Hepatitis B", "Measles", "MMR"};
        int total = 100;

        for (String service : services) {
            Map<String, Object> data = new HashMap<>();
            int percentage = (int) (Math.random() * 30) + 5; // 5% to 35%
            data.put("service", service);
            data.put("percentage", percentage);
            distribution.add(data);
            total -= percentage;
        }

        // Thêm phần còn lại nếu cần
        if (total > 0) {
            Map<String, Object> data = new HashMap<>();
            data.put("service", "Others");
            data.put("percentage", total);
            distribution.add(data);
        }

        return distribution;
    }

    public List<Map<String, Object>> getTrendData(String period) {
        List<Map<String, Object>> trendData = new ArrayList<>();
        LocalDate startDate;
        LocalDate endDate = LocalDate.now();
        int increment;

        // Xác định thời gian bắt đầu và cách tăng dựa trên period
        if ("day".equals(period)) {
            startDate = endDate.minusDays(30);
            increment = 1;
        } else if ("week".equals(period)) {
            startDate = endDate.minusWeeks(12);
            increment = 7;
        } else if ("year".equals(period)) {
            startDate = endDate.minusYears(5);
            increment = 365;
        } else { // month (default)
            startDate = endDate.minusMonths(12);
            increment = 30;
        }

        // Tạo dữ liệu xu hướng
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate current = startDate;

        while (!current.isAfter(endDate)) {
            Map<String, Object> data = new HashMap<>();
            data.put("date", current.format(formatter));
            data.put("count", (int) (Math.random() * 20)); // Random data
            trendData.add(data);

            current = current.plusDays(increment);
        }

        return trendData;
    }
}
