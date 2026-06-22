package com.healthcare.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healthcare.entity.PatientProfile;



@Repository
public interface
PatientProfileRepository
        extends JpaRepository<
        PatientProfile,
        Long> {

    Optional<PatientProfile>
    findByPatientId(
            Long patientId
    );

}