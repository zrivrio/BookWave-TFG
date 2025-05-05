package com.BookWave.bookstreaming.domain;

import java.util.Date;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "helprequest")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HelpRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private String subject;
    private String message;
    private Date createdAt;
    private boolean isResolved = false;
}
