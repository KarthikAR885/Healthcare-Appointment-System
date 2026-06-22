package com.healthcare.repository;

import com.healthcare.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByPatientIdOrderByCreatedDateDesc(Long patientId);

    List<Prescription> findByDoctorIdOrderByCreatedDateDesc(Long doctorId);
}
