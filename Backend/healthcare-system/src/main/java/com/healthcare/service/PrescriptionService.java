package com.healthcare.service;

import com.healthcare.dto.PrescriptionRequest;
import com.healthcare.dto.PrescriptionResponse;

import java.util.List;

public interface PrescriptionService {

    PrescriptionResponse createPrescription(PrescriptionRequest request);

    List<PrescriptionResponse> getPrescriptionsByPatient(Long patientId);

    List<PrescriptionResponse> getPrescriptionsByDoctor(Long doctorId);

    PrescriptionResponse getPrescription(Long id);
}
