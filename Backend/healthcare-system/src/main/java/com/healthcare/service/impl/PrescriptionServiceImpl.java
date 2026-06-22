package com.healthcare.service.impl;

import com.healthcare.dto.PrescriptionRequest;
import com.healthcare.dto.PrescriptionResponse;
import com.healthcare.entity.Doctor;
import com.healthcare.entity.Patient;
import com.healthcare.entity.Prescription;
import com.healthcare.exception.ResourceNotFoundException;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.repository.PatientRepository;
import com.healthcare.repository.PrescriptionRepository;
import com.healthcare.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public PrescriptionResponse createPrescription(PrescriptionRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setMedicines(request.getMedicines());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setNotes(request.getNotes());
        prescription.setCreatedDate(LocalDate.now());

        return mapToResponse(prescriptionRepository.save(prescription));
    }

    @Override
    public List<PrescriptionResponse> getPrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatientIdOrderByCreatedDateDesc(patientId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<PrescriptionResponse> getPrescriptionsByDoctor(Long doctorId) {
        return prescriptionRepository.findByDoctorIdOrderByCreatedDateDesc(doctorId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public PrescriptionResponse getPrescription(Long id) {
        return prescriptionRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
    }

    private PrescriptionResponse mapToResponse(Prescription prescription) {
        return PrescriptionResponse.builder()
                .id(prescription.getId())
                .patientId(prescription.getPatient().getId())
                .doctorId(prescription.getDoctor().getId())
                .patientName(prescription.getPatient().getFullName())
                .doctorName(prescription.getDoctor().getDoctorName())
                .medicines(prescription.getMedicines())
                .diagnosis(prescription.getDiagnosis())
                .notes(prescription.getNotes())
                .createdDate(prescription.getCreatedDate())
                .build();
    }
}
