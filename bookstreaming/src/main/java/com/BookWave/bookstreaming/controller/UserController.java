package com.BookWave.bookstreaming.controller;

import com.BookWave.bookstreaming.domain.LoginRequest;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;


    //Logica para crear usuario
    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.registerUser(user);
    }

    //Logica para logearse
    @PostMapping("/login")
    public User login(@RequestBody LoginRequest loginRequest) {
        return userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
    }

    @PostMapping("/upgrade/{userId}")
public User upgradeToPremium(@PathVariable Long userId) {
    return userService.upgradeUserToPremium(userId);
}
}
