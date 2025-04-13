package com.vactrack.config;

import com.vactrack.model.Appointment;
import com.vactrack.model.User;
import com.vactrack.repository.AppointmentRepository;
import com.vactrack.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

    public DataLoader(UserRepository userRepository,
                      AppointmentRepository appointmentRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Kiểm tra xem đã có admin chưa
        if (userRepository.findByRole("ADMIN").isEmpty()) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setAvatar("https://ui-avatars.com/api/?name=Admin+User&background=random");

            userRepository.save(admin);
            System.out.println("Created default admin account");

            // Tạo một người dùng thông thường
            User user = new User();
            user.setName("Regular User");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole("USER");
            user.setAvatar("https://ui-avatars.com/api/?name=Regular+User&background=random");

            userRepository.save(user);
            System.out.println("Created default user account");

            // Tạo dữ liệu mẫu cho cuộc hẹn
            createSampleAppointments();
        }
    }

    private void createSampleAppointments() {
        List<String> services = Arrays.asList("BCG Vaccine", "Polio Vaccine", "Hepatitis B Vaccine",
                "MMR Vaccine", "DTaP Vaccine");
        List<String> statuses = Arrays.asList("completed", "pending", "canceled");
        List<String> names = Arrays.asList("Nguyen Van A", "Tran Thi B", "Le Van C",
                "Pham Thi D", "Hoang Van E", "Vo Thi F");

        LocalDate today = LocalDate.now();

        for (int i = 0; i < 50; i++) {
            Appointment appointment = new Appointment();
            appointment.setPatientName(names.get(random.nextInt(names.size())));
            appointment.setService(services.get(random.nextInt(services.size())));
            appointment.setStatus(statuses.get(random.nextInt(statuses.size())));
            appointment.setAppointmentDate(today.minusDays(random.nextInt(60)));
            appointment.setAppointmentTime(LocalTime.of(8 + random.nextInt(9), random.nextInt(12) * 5));
            appointment.setNotes("Sample appointment note " + (i + 1));

            appointmentRepository.save(appointment);
        }

        System.out.println("Created 50 sample appointments");
    }
}
