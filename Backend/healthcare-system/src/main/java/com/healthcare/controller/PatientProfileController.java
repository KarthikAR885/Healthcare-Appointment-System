package com.healthcare.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.healthcare.entity.PatientProfile;
import com.healthcare.repository.PatientProfileRepository;



@RestController
@RequestMapping(
        "/api/profile"
)

public class PatientProfileController {



    private final
    PatientProfileRepository
            repository;




    // Constructor
    public PatientProfileController(

            PatientProfileRepository repository

    ) {

        this.repository =
                repository;

    }




    // Save Profile
    @PostMapping
    public PatientProfile
    saveProfile(

            @RequestBody
            PatientProfile profile

    ) {

        PatientProfile savedProfile =
                repository
                        .findByPatientId(
                                profile.getPatientId()
                        )
                        .orElse(
                                new PatientProfile()
                        );

        savedProfile.setPatientId(
                profile.getPatientId()
        );

        savedProfile.setAge(
                profile.getAge()
        );

        savedProfile.setGender(
                profile.getGender()
        );

        savedProfile.setBloodGroup(
                profile.getBloodGroup()
        );

        savedProfile.setMedicalHistory(
                profile.getMedicalHistory()
        );

        savedProfile.setDoctorNotes(
                profile.getDoctorNotes()
        );

        return repository.save(
                savedProfile
        );

    }




    // Get One Patient Profile
    @GetMapping(
            "/{patientId}"
    )
    public PatientProfile
    getProfile(

            @PathVariable
            Long patientId

    ) {

        return repository
                .findByPatientId(
                        patientId
                )
                .orElse(
                        null
                );

    }




    // Get All Patient Profiles
    @GetMapping(
            "/all"
    )
    public List<PatientProfile>
    getAllProfiles() {

        return repository.findAll();

    }

}
