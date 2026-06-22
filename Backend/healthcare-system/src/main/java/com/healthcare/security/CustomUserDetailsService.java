package com.healthcare.security;

import com.healthcare.entity.Admin;
import com.healthcare.entity.Patient;
import com.healthcare.enums.Role;
import com.healthcare.repository.AdminRepository;
import com.healthcare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final PatientRepository patientRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Check if Admin
        Optional<Admin> adminOptional = adminRepository.findByUsername(username);
        if (adminOptional.isPresent()) {
            Admin admin = adminOptional.get();
            return new User(admin.getUsername(), admin.getPassword(), getAuthorities("ROLE_ADMIN"));
        }

        // Check if Patient (Email is used as username)
        Optional<Patient> patientOptional = patientRepository.findByEmail(username);
        if (patientOptional.isPresent()) {
            Patient patient = patientOptional.get();
            Role role = patient.getRole() != null ? patient.getRole() : Role.PATIENT;
            return new User(
                    patient.getEmail(),
                    patient.getPassword(),
                    getAuthorities("ROLE_" + role.name())
            );
        }

        throw new UsernameNotFoundException("User not found with username/email: " + username);
    }

    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }
}
