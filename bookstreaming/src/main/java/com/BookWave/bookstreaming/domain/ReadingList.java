package com.BookWave.bookstreaming.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    
    @ManyToMany(mappedBy = "readingLists", fetch = FetchType.LAZY)
    private List<Book> books = new ArrayList<>();
    
    public void addBook(Book book) {
        if (!this.books.contains(book)) {
            this.books.add(book);
        }
        if (!book.getReadingLists().contains(this)) {
            book.getReadingLists().add(this);
        }
    }
    
    public void removeBook(Book book) {
        this.books.remove(book);
        book.getReadingLists().remove(this);
    }
    
    @JsonIgnore
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }
}