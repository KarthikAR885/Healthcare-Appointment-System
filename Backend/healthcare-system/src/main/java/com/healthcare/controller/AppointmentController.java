package com.healthcare.controller;

import com.healthcare.dto.AppointmentRequest;
import com.healthcare.dto.AppointmentResponse;

import com.healthcare.service.AppointmentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping(
        "/api/appointments"
)

public class AppointmentController {



    private final
    AppointmentService
            appointmentService;




    // Constructor
    public AppointmentController(

            AppointmentService appointmentService

    ) {

        this.appointmentService =
                appointmentService;

    }




    // Book Appointment
    @PostMapping
    public ResponseEntity<
            AppointmentResponse
            >
    bookAppointment(

            @Valid
            @RequestBody
            AppointmentRequest appointmentRequest

    ) {

        AppointmentResponse response =

                appointmentService
                        .bookAppointment(
                                appointmentRequest
                        );



        return new ResponseEntity<>(

                response,

                HttpStatus.CREATED

        );

    }




    // Patient Appointments
    @GetMapping(
            "/patient/{patientId}"
    )
    public ResponseEntity<
            List<AppointmentResponse>
            >
    getPatientAppointments(

            @PathVariable
            Long patientId

    ) {

        return ResponseEntity.ok(

                appointmentService
                        .getAppointmentsByPatientId(
                                patientId
                        )

        );

    }




    // Doctor Appointments
    @GetMapping(
            "/doctor/{doctorId}"
    )
    public ResponseEntity<
            List<AppointmentResponse>
            >
    getDoctorAppointments(

            @PathVariable
            Long doctorId

    ) {

        return ResponseEntity.ok(

                appointmentService
                        .getAppointmentsByDoctorId(
                                doctorId
                        )

        );

    }




    // Cancel Appointment
    @PutMapping(
            "/{id}/cancel"
    )
    public ResponseEntity<
            AppointmentResponse
            >
    cancelAppointment(

            @PathVariable
            Long id

    ) {

        return ResponseEntity.ok(

                appointmentService
                        .cancelAppointment(
                                id
                        )

        );

    }




    // Approve Appointment
    @PutMapping(
            "/{id}/approve"
    )
    public ResponseEntity<
            AppointmentResponse
            >
    approveAppointment(

            @PathVariable
            Long id

    ) {

        return ResponseEntity.ok(

                appointmentService
                        .approveAppointment(
                                id
                        )

        );

    }




    // Complete Appointment
    @PutMapping(
            "/{id}/complete"
    )
    public ResponseEntity<
            AppointmentResponse
            >
    completeAppointment(

            @PathVariable
            Long id

    ) {

        return ResponseEntity.ok(

                appointmentService
                        .completeAppointment(
                                id
                        )

        );

    }

}
