package com.BookWave.bookstreaming.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    @Pattern(regexp = "^[a-zA-Z0-9_]{3,50}$", message = "El nombre de usuario debe tener entre 3 y 50 caracteres y solo puede contener letras, números y guiones bajos")
    private String username; 

    @Column(nullable = false, unique = true)
    @Email(message = "El formato del email no es válido")
    private String email;

    @Column(nullable = false)
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.User;

    @Enumerated(EnumType.STRING)
    private SubscriptionType subscriptionType = SubscriptionType.Free; 


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReadingList> readingLists = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<HelpRequest> helpRequests = new ArrayList<>();

    public void addReadingList(ReadingList list) {
        this.readingLists.add(list);
        list.setUser(this);
    }
    
}

