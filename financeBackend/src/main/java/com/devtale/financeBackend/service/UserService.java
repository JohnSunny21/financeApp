package com.devtale.financeBackend.service;

import com.devtale.financeBackend.model.User;
import com.devtale.financeBackend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public void changeUserPassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found : " + username));

        // Verify the current Password
        if(!passwordEncoder.matches(currentPassword,user.getPassword())){
            // Throw a specific exception or a generic one
            throw new IllegalArgumentException("Incorrect Current password.");
        }

        if(passwordEncoder.matches(newPassword,user.getPassword())){

            throw new IllegalArgumentException("New Password cannot be the same as the old password.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

}
