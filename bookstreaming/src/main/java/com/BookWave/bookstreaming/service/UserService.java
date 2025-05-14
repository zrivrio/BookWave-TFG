package com.BookWave.bookstreaming.service;

import com.BookWave.bookstreaming.domain.Role;
import com.BookWave.bookstreaming.domain.SubscriptionType;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.repository.UserRepository;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;

import com.BookWave.bookstreaming.util.util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Validaciones básicas
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de usuario no puede estar vacío");
        }
        if (user.getEmail() == null || !user.getEmail().contains("@")) {
            throw new IllegalArgumentException("El email no es válido");
        }
        if (user.getPassword() == null || user.getPassword().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }

        try {
            String hashedPassword = util.hashPassword(user.getPassword());
            user.setPassword(hashedPassword);
            return userRepository.save(user);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error al procesar la contraseña", e);
        }
    }

    public User loginUser(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            try {
                String hashedInput = util.hashPassword(password);
                if (hashedInput.equals(user.getPassword())) {
                    return user;
                }
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("Error al verificar la contraseña", e);
            }
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

    public User updateUser(Long userId, Map<String, Object> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar username si se proporciona y es diferente
        if (updates.containsKey("username")) {
            String newUsername = (String) updates.get("username");
            if (!newUsername.equals(user.getUsername())) {
                if (userRepository.existsByUsernameAndIdNot(newUsername, userId)) {
                    throw new IllegalArgumentException("El nombre de usuario ya está en uso");
                }
                user.setUsername(newUsername);
            }
        }

        // Actualizar email si se proporciona y es diferente
        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            if (!newEmail.equals(user.getEmail())) {
                if (userRepository.existsByEmailAndIdNot(newEmail, userId)) {
                    throw new IllegalArgumentException("El email ya está en uso");
                }
                user.setEmail(newEmail);
            }
        }

        // Actualizar role si se proporciona
        if (updates.containsKey("role")) {
            user.setRole(Role.valueOf((String) updates.get("role")));
        }

        // Actualizar subscriptionType si se proporciona
        if (updates.containsKey("subscriptionType")) {
            user.setSubscriptionType(SubscriptionType.valueOf((String) updates.get("subscriptionType")));
        }

        // Actualizar contraseña si se proporciona
        if (updates.containsKey("password")) {
            try {
                String newPassword = (String) updates.get("password");
                String hashedPassword = util.hashPassword(newPassword);
                user.setPassword(hashedPassword);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("Error al hashear la contraseña", e);
            }
        }

        return userRepository.save(user);
    }

    //Métodos de Administrador
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }
}