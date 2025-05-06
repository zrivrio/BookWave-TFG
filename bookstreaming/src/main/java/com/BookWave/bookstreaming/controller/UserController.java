package com.BookWave.bookstreaming.controller;

import com.BookWave.bookstreaming.domain.LoginRequest;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.service.UserService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest loginRequest) {
        return userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
    }

    @PostMapping("/upgrade/{userId}")
    public User upgradeToPremium(@PathVariable Long userId) {
        return userService.upgradeUserToPremium(userId);
    }

    @PutMapping("/{userId}")
    public User updateUser(  @PathVariable Long userId,
    @RequestBody Map<String, Object> updates) {
        return userService.updateUser(userId, updates);
    }

    //Métodos de Administrador
    @GetMapping("/admin/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/admin/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
    }

}
