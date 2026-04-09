package com.genbridge.backend.user;

import com.genbridge.backend.auth.dto.ChangePasswordRequest;
import com.genbridge.backend.auth.dto.LoginRequest;
import com.genbridge.backend.auth.dto.LoginResponse;
import com.genbridge.backend.auth.dto.RegistrationRequest;

/** Defines operations for user registration, authentication, password changes, and streak management. */
public interface UserService {
    void registerUser(RegistrationRequest request);
    LoginResponse loginUser(LoginRequest request);
    User getByEmail(String email);
    void updateStreak(User user);
    void changePassword(String email, ChangePasswordRequest request);
}
