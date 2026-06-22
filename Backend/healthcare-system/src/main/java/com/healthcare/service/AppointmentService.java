package com.healthcare.service;

import com.healthcare.dto.AppointmentRequest;
import com.healthcare.dto.AppointmentResponse;

import java.util.List;



public interface AppointmentService {

    AppointmentResponse
    bookAppointment(
            AppointmentRequest appointmentRequest
    );



    List<AppointmentResponse>
    getAppointmentsByPatientId(
            Long patientId
    );



    AppointmentResponse
    cancelAppointment(
            Long id
    );



    // NEW
    AppointmentResponse
    approveAppointment(
            Long id
    );



    AppointmentResponse
    completeAppointment(
            Long id
    );



    List<AppointmentResponse>
    getAllAppointments();



    List<AppointmentResponse>
    getAppointmentsByDoctorId(
            Long doctorId
    );

}
