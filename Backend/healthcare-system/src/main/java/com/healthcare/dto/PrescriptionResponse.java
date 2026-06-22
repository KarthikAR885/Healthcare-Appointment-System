package com.healthcare.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class PrescriptionResponse {

    private Long id;
    private Long patientId;
    private Long doctorId;
    private String patientName;
    private String doctorName;
    private String medicines;
    private String diagnosis;
    private String notes;
    private LocalDate createdDate;
}
