package com.healthcare.entity;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;



@Entity
@Table(
        name = "patient_profiles"
)

@Data
@NoArgsConstructor
@AllArgsConstructor

public class PatientProfile {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;



    // IMPORTANT
    private Long patientId;



    private Integer age;



    private String gender;



    private String bloodGroup;



    private String medicalHistory;



    private String doctorNotes;

}