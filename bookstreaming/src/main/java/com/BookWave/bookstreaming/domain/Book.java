package com.BookWave.bookstreaming.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String author;
    private String description;
    private String cover;
    private String language;
    private int year;
    private Double averageRating;

    //Relaciones
    @ManyToMany(mappedBy = "books")
    @JsonIgnore
    private Set<Category> categories;

    @OneToMany(mappedBy = "book")
    @JsonIgnore
    private List<ReadingProgress> readingProgresses;

    @ManyToMany(mappedBy = "books")
    @JsonIgnore
    private Set<ReadingList> readingLists;

}

