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
@Table(name = "reading_lists")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReadingList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToMany
    @JoinTable(
        name = "reading_list_books",
        joinColumns = @JoinColumn(name = "reading_list_id"),
        inverseJoinColumns = @JoinColumn(name = "book_id"))
    private Set<Book> books = new HashSet<>();

     // Métodos de conveniencia para manejar la relación bidireccional
     public void addBook(Book book) {
        this.books.add(book);
        book.getReadingLists().add(this);
    }
    
    public void removeBook(Book book) {
        this.books.remove(book);
        book.getReadingLists().remove(this);
    }
    

}
