package com.example.login.service;

import com.example.login.model.AppUser;
import com.example.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public AppUser findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean validateUser(String username, String password) {
        AppUser user = findByUsername(username);
        return user != null && user.getPassword().equals(password);
    }

    public void initUsers() {
        if (userRepository.count() == 0) {
            AppUser admin = new AppUser("admin", "admin123", "Administrator");
            AppUser user = new AppUser("user", "user123", "Regular User");

            userRepository.save(admin);
            userRepository.save(user);

            System.out.println("Dữ liệu mẫu đã được khởi tạo");
        }
    }
}
