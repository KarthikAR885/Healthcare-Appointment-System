package com.healthcare.controller;

import com.healthcare.dto.PrescriptionRequest;
import com.healthcare.dto.PrescriptionResponse;
import com.healthcare.service.PrescriptionService;
import com.healthcare.service.PrescriptionPdfService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping(
        "/api/prescription"
)
@RequiredArgsConstructor
@SuppressWarnings("null")
public class PrescriptionController {

    private final
    PrescriptionPdfService
            pdfService;

    private final PrescriptionService prescriptionService;

    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping
    public ResponseEntity<PrescriptionResponse> createPrescription(
            @Valid @RequestBody PrescriptionRequest request
    ) {
        return ResponseEntity.ok(
                prescriptionService.createPrescription(request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionResponse> getPrescription(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                prescriptionService.getPrescription(id)
        );
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponse>> getPatientPrescriptions(
            @PathVariable Long patientId
    ) {
        return ResponseEntity.ok(
                prescriptionService.getPrescriptionsByPatient(patientId)
        );
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionResponse>> getDoctorPrescriptions(
            @PathVariable Long doctorId
    ) {
        return ResponseEntity.ok(
                prescriptionService.getPrescriptionsByDoctor(doctorId)
        );
    }



    @GetMapping(
            "/download/{id}"
    )
    public ResponseEntity<byte[]>
    downloadPrescription(
            @PathVariable Long id
    ) {

        PrescriptionResponse prescription =
                prescriptionService.getPrescription(id);

        byte[] pdf =

                pdfService
                        .generatePrescription(

                                prescription.getPatientName(),

                                prescription.getDoctorName(),

                                prescription.getDiagnosis(),

                                prescription.getMedicines(),

                                prescription.getNotes()

                        );



        return ResponseEntity
                .ok()
                .header(

                        HttpHeaders
                                .CONTENT_DISPOSITION,

                        "attachment; filename=prescription.pdf"

                )
                .contentType(

                        MediaType
                                .APPLICATION_PDF

                )
                .body(
                        pdf
                );

    }

    @GetMapping(
            "/download"
    )
    public ResponseEntity<byte[]> downloadLatestPatientPrescription(
            @RequestParam Long patientId
    ) {
        PrescriptionResponse prescription =
                prescriptionService.getPrescriptionsByPatient(patientId)
                        .stream()
                        .findFirst()
                        .orElseThrow();

        return downloadPrescription(prescription.getId());
    }

}
