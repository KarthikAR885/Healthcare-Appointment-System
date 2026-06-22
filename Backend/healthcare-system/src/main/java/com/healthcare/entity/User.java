package com.healthcare.entity;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import com.healthcare.enums.Role;


@Entity
@Table(
        name = "users"
)

@Data
@NoArgsConstructor
@AllArgsConstructor

public class User {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;



    private String fullName;



    @Column(
            unique = true
    )
    private String email;



    private String password;



    @Enumerated(
            EnumType.STRING
    )
    private Role role;

}
