package com.BookWave.bookstreaming.domain;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
