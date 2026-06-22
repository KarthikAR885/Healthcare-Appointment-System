package com.healthcare.service.impl;

import com.healthcare.dto.DoctorDto;
import com.healthcare.entity.Doctor;
import com.healthcare.exception.ResourceNotFoundException;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Override
    public DoctorDto addDoctor(DoctorDto doctorDto) {
        Doctor doctor = new Doctor();
        doctor.setDoctorName(doctorDto.getDoctorName());
        doctor.setSpecialization(doctorDto.getSpecialization());
        doctor.setExperience(doctorDto.getExperience());
        doctor.setAvailableStatus(doctorDto.getAvailableStatus() != null ? doctorDto.getAvailableStatus() : true);
        
        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapToDto(savedDoctor);
    }

    @Override
    public DoctorDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        return mapToDto(doctor);
    }

    @Override
    public List<DoctorDto> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public DoctorDto updateDoctor(Long id, DoctorDto doctorDto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));

        doctor.setDoctorName(doctorDto.getDoctorName());
        doctor.setSpecialization(doctorDto.getSpecialization());
        doctor.setExperience(doctorDto.getExperience());
        if (doctorDto.getAvailableStatus() != null) {
            doctor.setAvailableStatus(doctorDto.getAvailableStatus());
        }

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return mapToDto(updatedDoctor);
    }

    @Override
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        doctorRepository.delete(doctor);
    }

    private DoctorDto mapToDto(Doctor doctor) {
        return DoctorDto.builder()
                .id(doctor.getId())
                .doctorName(doctor.getDoctorName())
                .specialization(doctor.getSpecialization())
                .experience(doctor.getExperience())
                .availableStatus(doctor.getAvailableStatus())
                .build();
    }
}
