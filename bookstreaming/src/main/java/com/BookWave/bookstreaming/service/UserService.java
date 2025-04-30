package com.BookWave.bookstreaming.service;

import com.BookWave.bookstreaming.domain.SubscriptionType;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.repository.UserRepository;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public User loginUser(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User upgradeUserToPremium(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setSubscriptionType(SubscriptionType.Premium);
        return userRepository.save(user);
    }

    public User updateUser(Long userId, User userDetails) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + userId));

        if (Objects.nonNull(userDetails.getUsername()) && !"".equalsIgnoreCase(userDetails.getUsername())) {
            user.setUsername(userDetails.getUsername());
        }

        if (Objects.nonNull(userDetails.getEmail()) && !"".equalsIgnoreCase(userDetails.getEmail())) {
            user.setEmail(userDetails.getEmail());
        }

        if (Objects.nonNull(userDetails.getSubscriptionType())) {
            user.setSubscriptionType(userDetails.getSubscriptionType());
        }

        return userRepository.save(user);
    }

}
