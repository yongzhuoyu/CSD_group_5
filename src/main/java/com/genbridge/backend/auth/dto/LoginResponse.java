package com.genbridge.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/** Returned after successful login: contains the JWT token, email, and role. */
@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private String role;
}
