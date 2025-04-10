package com.BookWave.bookstreaming.service;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.ReadingProgress;
import com.BookWave.bookstreaming.repository.BookRepository;
import com.BookWave.bookstreaming.repository.ReadingProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ReadingProgressRepository readingProgressRepository;

    //Metodos de Usuario
    public List<Book> getBooksInProgressByUserId(Long userId) {
        List<Book> books = bookRepository.findBooksInProgressByUserId(userId);
        
        books.forEach(book -> {
            ReadingProgress progress = readingProgressRepository.findByUserIdAndBookId(userId, book.getId())
                .orElse(null);
            if (progress != null) {
                if (book.getReadingProgresses() == null) {
                    book.setReadingProgresses(new ArrayList<>());
                }
                book.getReadingProgresses().clear();
                book.getReadingProgresses().add(progress);
            }
        });
        
        return books;
    }

    public List<Book> getBooksBySearch(String searchTerm) {
        return bookRepository.findBooksBySearch(searchTerm.trim());
    }

    //Metodos de Admin
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(long id) {
        return bookRepository.findById(id).orElse(null);
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public void deleteBookById(long id) {
       this.bookRepository.deleteById(id);
    }

    public Book updateBook(Book book) {
        return this.bookRepository.save(book);
    }

}
