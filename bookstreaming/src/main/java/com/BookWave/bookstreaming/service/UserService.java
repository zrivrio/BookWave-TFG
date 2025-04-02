package com.BookWave.bookstreaming.service;

import com.BookWave.bookstreaming.domain.SubscriptionType;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }


    //Logica paar autentificar un usuraio
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

}
