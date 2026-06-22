package com.healthcare.entity;

import jakarta.persistence.*;



@Entity
@Table(
        name = "doctors"
)

public class Doctor {



    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;



    @Column(
            nullable = false
    )
    private String doctorName;



    @Column(
            nullable = false
    )
    private String specialization;



    @Column(
            nullable = false
    )
    private Integer experience;



    @Column(
            nullable = false
    )
    private Boolean availableStatus;





    // Getters + Setters

    public Long getId() {
        return id;
    }



    public void setId(
            Long id
    ) {
        this.id = id;
    }



    public String getDoctorName() {
        return doctorName;
    }



    public void setDoctorName(
            String doctorName
    ) {
        this.doctorName =
                doctorName;
    }



    public String getSpecialization() {
        return specialization;
    }



    public void setSpecialization(
            String specialization
    ) {
        this.specialization =
                specialization;
    }



    public Integer getExperience() {
        return experience;
    }



    public void setExperience(
            Integer experience
    ) {
        this.experience =
                experience;
    }



    public Boolean getAvailableStatus() {
        return availableStatus;
    }



    public void setAvailableStatus(
            Boolean availableStatus
    ) {
        this.availableStatus =
                availableStatus;
    }

}