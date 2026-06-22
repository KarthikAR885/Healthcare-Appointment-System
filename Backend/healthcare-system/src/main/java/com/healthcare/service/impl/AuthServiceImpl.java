package com.healthcare.service.impl;

import com.healthcare.dto.AuthRequest;
import com.healthcare.dto.AuthResponse;
import com.healthcare.dto.RegisterRequest;
import com.healthcare.entity.Admin;
import com.healthcare.entity.Doctor;
import com.healthcare.entity.Patient;
import com.healthcare.repository.AdminRepository;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.repository.PatientRepository;
import com.healthcare.security.JwtUtils;
import com.healthcare.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final PatientRepository patientRepository;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Override
    public String registerPatient(RegisterRequest request) {

        Patient patient = new Patient();
        patient.setFullName(request.getFullName());
        patient.setEmail(request.getEmail());
        patient.setPhone(request.getPhone());
        patient.setPassword(passwordEncoder.encode(request.getPassword()));
        patient.setRole(request.getRole());

        patientRepository.save(patient);

        return "Patient Registered Successfully";
    }

    @Override
    public AuthResponse login(AuthRequest request) {

        System.out.println("Username = " + request.getUsername());
        System.out.println("Password = " + request.getPassword());

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        String token =
                jwtUtils.generateToken(authentication);

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        Long userId = getUserId(request.getUsername(), role);

        return AuthResponse.builder()
                .userId(userId)
                .token(token)
                .role(role)
                .message("Login Successful")
                .build();
    }

    private Long getUserId(String username, String role) {

        if ("ADMIN".equals(role)) {
            return adminRepository.findByUsername(username)
                    .map(Admin::getId)
                    .orElse(null);
        }

        if ("DOCTOR".equals(role)) {
            return patientRepository.findByEmail(username)
                    .map(Patient::getFullName)
                    .flatMap(doctorRepository::findByDoctorName)
                    .map(Doctor::getId)
                    .orElse(null);
        }

        return patientRepository.findByEmail(username)
                .map(Patient::getId)
                .orElse(null);
    }
}
