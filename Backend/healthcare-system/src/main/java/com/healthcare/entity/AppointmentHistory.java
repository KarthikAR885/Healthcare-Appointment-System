package com.healthcare.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;



@Entity
@Table(
        name =
                "patient_appointment_history"
)

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AppointmentHistory {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;



    private Long patientId;



    private String doctorName;



    private LocalDate appointmentDate;



    private String treatmentNotes;

}