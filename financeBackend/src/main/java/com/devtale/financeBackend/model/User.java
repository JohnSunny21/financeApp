package com.devtale.financeBackend.model;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="users")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @Column can be used to specify details about the column like name, length, nullable, unique.
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
}
