package com.BookWave.bookstreaming.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.NaturalId;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String googleBooksId;

    private String title;

    @ElementCollection
    private List<String> authors;

    private String description;

    private String thumbnail;

    private String publishedDate;

    private String language;

    @ElementCollection
    private List<String> categories;
}

