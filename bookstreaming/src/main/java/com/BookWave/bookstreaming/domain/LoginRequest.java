package com.BookWave.bookstreaming.domain;

public class LoginRequest {
    private String username;
    private String password;

    // Getters y Setters
    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return password;
    }


    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
