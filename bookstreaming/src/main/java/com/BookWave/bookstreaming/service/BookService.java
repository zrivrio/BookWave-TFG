package com.BookWave.bookstreaming.service;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    //Metodos de Usuario
    public List<Book> getBooksInProgressByUserId(Long userId) {
        return bookRepository.findBooksInProgressByUserId(userId);
    }

    
    public List<Book> getUserBooks(Long userId) {
        return bookRepository.findBooksByUserId(userId);
    }

    //AMetodos de Administrador
    //CRUD
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
