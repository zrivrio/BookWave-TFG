package com.BookWave.bookstreaming.controller;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    //Usuario
    @GetMapping("/user/{userId}")
    public List<Book> getUserBooks(@PathVariable Long userId) {
        return bookService.getUserBooks(userId);
    }

    @GetMapping("/recommendedBooks/{userId}")
    public List<Book> getRecommendedBooks(@PathVariable Long userId) {
        return bookService.getRecommendedBooks(userId);
   
    }

    @GetMapping("/progress/{userId}")
    public List<Book> getBooksInProgress(@PathVariable Long userId) {
        return bookService.getBooksInProgressByUserId(userId);
    }


    //Administrador
    @GetMapping({"", "/"})
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable int id) {
        return bookService.getBookById(id);
    }

    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookService.saveBook(book);
    }

    @PutMapping
    public Book updateBook(@RequestBody Book book) {
        return bookService.updateBook(book);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable int id) {
        bookService.deleteBookById(id);
    }
}
