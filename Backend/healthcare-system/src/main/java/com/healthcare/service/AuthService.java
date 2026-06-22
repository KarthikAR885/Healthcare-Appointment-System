package com.healthcare.service;

import com.healthcare.dto.AuthRequest;
import com.healthcare.dto.AuthResponse;
import com.healthcare.dto.RegisterRequest;

public interface AuthService {

    // Register new patient
    String registerPatient(RegisterRequest request);

    // Login for Admin / Doctor / Patient
    AuthResponse login(AuthRequest request);

}