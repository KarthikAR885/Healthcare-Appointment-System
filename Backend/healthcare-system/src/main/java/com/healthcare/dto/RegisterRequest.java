package com.healthcare.dto;

import lombok.Data;

import com.healthcare.enums.Role;


@Data
public class RegisterRequest {

    private String fullName;

    private String email;
    
    private String phone;

    private String password;

    private Role role;

}