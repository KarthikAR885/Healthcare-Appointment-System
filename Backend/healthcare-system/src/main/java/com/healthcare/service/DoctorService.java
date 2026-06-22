package com.healthcare.service;

import com.healthcare.dto.DoctorDto;
import java.util.List;

public interface DoctorService {
    DoctorDto addDoctor(DoctorDto doctorDto);
    DoctorDto getDoctorById(Long id);
    List<DoctorDto> getAllDoctors();
    DoctorDto updateDoctor(Long id, DoctorDto doctorDto);
    void deleteDoctor(Long id);
}
