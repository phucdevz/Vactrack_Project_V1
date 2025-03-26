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
        LocalDate startDate = LocalDate.now().minusMonths(11);
        List<Object[]> results = appointmentRepository.countByMonth(startDate);

        List<Map<String, Object>> monthlyData = new ArrayList<>();
        for (Object[] result : results) {
            Map<String, Object> data = new HashMap<>();
            int month = ((Number) result[0]).intValue();
            long count = ((Number) result[1]).longValue();

            data.put("month", getMonthName(month));
            data.put("count", count);
            monthlyData.add(data);
        }

        return monthlyData;
    }

    public List<Map<String, Object>> getDistributionByService() {
        List<Object[]> results = appointmentRepository.countByService();

        long total = appointmentRepository.count();
        List<Map<String, Object>> distributionData = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> data = new HashMap<>();
            String service = (String) result[0];
            long count = ((Number) result[1]).longValue();
            double percentage = (double) count / total * 100;

            data.put("service", service);
            data.put("percentage", Math.round(percentage * 100.0) / 100.0); // Round to 2 decimal places
            distributionData.add(data);
        }

        return distributionData;
    }

    public List<Map<String, Object>> getTrendData(String period) {
        // This is a simplified implementation
        // In a real application, you would query the database based on the period

        List<Map<String, Object>> trendData = new ArrayList<>();
        LocalDate date = LocalDate.now().minusDays(30);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (int i = 0; i < 30; i++) {
            Map<String, Object> data = new HashMap<>();
            date = date.plusDays(1);
            data.put("date", date.format(formatter));
            data.put("count", (int) (Math.random() * 10)); // Random data for demonstration
            trendData.add(data);
        }

        return trendData;
    }

    private String getMonthName(int month) {
        return new String[]{"January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"}[month-1];
    }
}
