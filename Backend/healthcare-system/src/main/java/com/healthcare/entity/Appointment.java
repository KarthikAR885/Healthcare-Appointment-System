package com.healthcare.entity;

import com.healthcare.enums.AppointmentStatus;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;



@Entity
@Table(
        name = "appointments"
)

public class Appointment {



    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;



    @ManyToOne
    private Patient patient;



    @ManyToOne
    private Doctor doctor;



    private LocalDate
            appointmentDate;



    private LocalTime
            appointmentTime;


    @Column(
            length = 1000
    )
    private String notes;



    @Enumerated(
            EnumType.STRING
    )
    private AppointmentStatus
            status;





    // Getters + Setters

    public Long getId() {
        return id;
    }



    public void setId(
            Long id
    ) {
        this.id = id;
    }



    public Patient getPatient() {
        return patient;
    }



    public void setPatient(
            Patient patient
    ) {
        this.patient = patient;
    }



    public Doctor getDoctor() {
        return doctor;
    }



    public void setDoctor(
            Doctor doctor
    ) {
        this.doctor = doctor;
    }



    public LocalDate
    getAppointmentDate() {
        return appointmentDate;
    }



    public void setAppointmentDate(
            LocalDate appointmentDate
    ) {
        this.appointmentDate =
                appointmentDate;
    }



    public LocalTime
    getAppointmentTime() {
        return appointmentTime;
    }



    public void setAppointmentTime(
            LocalTime appointmentTime
    ) {
        this.appointmentTime =
                appointmentTime;
    }


    public String getNotes() {
        return notes;
    }



    public void setNotes(
            String notes
    ) {
        this.notes =
                notes;
    }



    public AppointmentStatus
    getStatus() {
        return status;
    }



    public void setStatus(
            AppointmentStatus status
    ) {
        this.status = status;
    }

}
