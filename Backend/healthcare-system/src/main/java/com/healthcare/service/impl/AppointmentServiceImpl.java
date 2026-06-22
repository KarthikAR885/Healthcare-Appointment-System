package com.healthcare.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.healthcare.dto.AppointmentRequest;
import com.healthcare.dto.AppointmentResponse;

import com.healthcare.entity.Appointment;
import com.healthcare.entity.Doctor;
import com.healthcare.entity.Patient;

import com.healthcare.enums.AppointmentStatus;

import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.repository.PatientRepository;

import com.healthcare.service.AppointmentService;



@Service
@SuppressWarnings("null")
public class AppointmentServiceImpl
        implements AppointmentService {



    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;





    // Constructor
    public AppointmentServiceImpl(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository
    ) {

        this.appointmentRepository =
                appointmentRepository;


        this.patientRepository =
                patientRepository;


        this.doctorRepository =
                doctorRepository;

    }





    // Book Appointment
    @Override
    public AppointmentResponse
    bookAppointment(

            AppointmentRequest request

    ) {

        Patient patient =

                patientRepository
                        .findById(

                                request.getPatientId()

                        )
                        .orElseThrow();



        Doctor doctor =

                doctorRepository
                        .findById(

                                request.getDoctorId()

                        )
                        .orElseThrow();




        Appointment appointment =
                new Appointment();



        appointment.setPatient(
                patient
        );


        appointment.setDoctor(
                doctor
        );


        appointment.setAppointmentDate(

                request
                        .getAppointmentDate()

        );


        appointment.setAppointmentTime(

                request
                        .getAppointmentTime()

        );


        appointment.setNotes(

                request
                        .getNotes()

        );


        appointment.setStatus(

                AppointmentStatus
                        .PENDING

        );



        appointment =
                appointmentRepository
                        .save(
                                appointment
                        );



        return mapToResponse(
                appointment
        );

    }





    // Patient Appointments
    @Override
    public List<AppointmentResponse>
    getAppointmentsByPatientId(

            Long patientId

    ) {

        return appointmentRepository
                .findByPatientId(
                        patientId
                )
                .stream()

                .map(
                        this::mapToResponse
                )

                .collect(
                        Collectors.toList()
                );

    }





    // Cancel Appointment
    @Override
    public AppointmentResponse
    cancelAppointment(

            Long id

    ) {

        Appointment appointment =

                appointmentRepository
                        .findById(
                                id
                        )
                        .orElseThrow();



        appointment.setStatus(

                AppointmentStatus
                        .CANCELLED

        );



        appointment =
                appointmentRepository
                        .save(
                                appointment
                        );



        return mapToResponse(
                appointment
        );

    }





    // Approve Appointment
    @Override
    public AppointmentResponse
    approveAppointment(

            Long id

    ) {

        Appointment appointment =

                appointmentRepository
                        .findById(
                                id
                        )
                        .orElseThrow();



        appointment.setStatus(

                AppointmentStatus
                        .APPROVED

        );



        appointment =
                appointmentRepository
                        .save(
                                appointment
                        );



        return mapToResponse(
                appointment
        );

    }




    @Override
    public AppointmentResponse
    completeAppointment(

            Long id

    ) {

        Appointment appointment =

                appointmentRepository
                        .findById(
                                id
                        )
                        .orElseThrow();



        appointment.setStatus(

                AppointmentStatus
                        .COMPLETED

        );



        appointment =
                appointmentRepository
                        .save(
                                appointment
                        );



        return mapToResponse(
                appointment
        );

    }





    // Admin View
    @Override
    public List<AppointmentResponse>
    getAllAppointments() {

        return appointmentRepository
                .findAll()
                .stream()

                .map(
                        this::mapToResponse
                )

                .collect(
                        Collectors.toList()
                );

    }





    // Doctor View
    @Override
    public List<AppointmentResponse>
    getAppointmentsByDoctorId(

            Long doctorId

    ) {

        return appointmentRepository
                .findByDoctorId(
                        doctorId
                )
                .stream()

                .map(
                        this::mapToResponse
                )

                .collect(
                        Collectors.toList()
                );

    }





    // Mapper
    private AppointmentResponse
    mapToResponse(

            Appointment appointment

    ) {

        AppointmentResponse response =
                new AppointmentResponse();



        response.setId(
                appointment.getId()
        );


        response.setPatientId(

                appointment
                        .getPatient()
                        .getId()

        );



        response.setDoctorId(

                appointment
                        .getDoctor()
                        .getId()

        );



        response.setPatientName(

                appointment
                        .getPatient()
                        .getFullName()

        );



        response.setDoctorName(

                appointment
                        .getDoctor()
                        .getDoctorName()

        );



        response.setSpecialization(

                appointment
                        .getDoctor()
                        .getSpecialization()

        );



        response.setAppointmentDate(

                appointment
                        .getAppointmentDate()

        );



        response.setAppointmentTime(

                appointment
                        .getAppointmentTime()

        );


        response.setNotes(

                appointment
                        .getNotes()

        );



        response.setStatus(

                appointment
                        .getStatus()
                        .name()

        );



        return response;

    }

}
