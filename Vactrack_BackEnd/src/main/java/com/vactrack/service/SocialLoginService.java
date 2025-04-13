 package com.vactrack.service;

 import com.vactrack.model.User;
 import com.vactrack.repository.UserRepository;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.stereotype.Service;

 import java.util.Optional;
 import java.util.UUID;

 @Service
 public class SocialLoginService {

     @Autowired
     private UserRepository userRepository;

     public User processOAuthUser(String provider, String providerId, String email, String name) {
         // Tìm user hiện tại dựa vào email
         Optional<User> existingUser = userRepository.findByEmail(email);

         if (existingUser.isPresent()) {
             return existingUser.get();
         }

         // Tạo user mới nếu chưa tồn tại
         User newUser = new User();
         newUser.setEmail(email);
         newUser.setName(name);
         newUser.setPassword(UUID.randomUUID().toString()); // Mật khẩu ngẫu nhiên
         newUser.setRole("USER");

         return userRepository.save(newUser);
     }
 }