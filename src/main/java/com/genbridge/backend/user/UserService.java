package com.genbridge.backend.user;

import com.genbridge.backend.auth.dto.LoginRequest;
import com.genbridge.backend.auth.dto.LoginResponse;
import com.genbridge.backend.auth.dto.RegistrationRequest;
import com.genbridge.backend.config.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public void registerUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName(), request.getEmail(), hashedPassword, "LEARNER");
        userRepository.save(user);
    }

    public LoginResponse loginUser(LoginRequest request) {
        // Step 1: Find the user by email. Throw a clear error if not found.
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        // Step 2: Compare the submitted password against the stored hash
        // passwordEncoder.matches() hashes the raw password and compares - never store raw passwords!
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        // Step 3: Credentials are correct — generate and return the JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new LoginResponse(token, user.getEmail(), user.getRole());
    }
}