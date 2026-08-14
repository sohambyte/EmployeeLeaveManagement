package com.leavemanagement.service;

import com.leavemanagement.dto.AuthResponse;
import com.leavemanagement.dto.LoginRequest;
import com.leavemanagement.dto.RegisterRequest;
import com.leavemanagement.entity.User;
import com.leavemanagement.exception.BadRequestException;
import com.leavemanagement.exception.UserAlreadyExistsException;
import com.leavemanagement.repository.UserRepository;
import com.leavemanagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Injected from application.properties (reads ADMIN_CODE env variable)
    @Value("${admin.code}")
    private String configuredAdminCode;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }

        // Determine role - default to EMPLOYEE
        String role = "ROLE_EMPLOYEE";

        if (request.getRole() != null) {
            String inputRole = request.getRole().toUpperCase().trim();

            if (inputRole.endsWith("ADMIN")) {
                // Backend verifies the admin code - never trust the frontend alone
                String submittedCode = request.getAdminCode();

                if (submittedCode == null || submittedCode.trim().isEmpty()) {
                    throw new BadRequestException("Admin code is required to register as Admin");
                }

                if (!submittedCode.trim().equals(configuredAdminCode)) {
                    throw new BadRequestException("Invalid admin code. Admin registration denied.");
                }

                // Admin code is correct - allow ADMIN role
                role = "ROLE_ADMIN";
            }
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole());

        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
