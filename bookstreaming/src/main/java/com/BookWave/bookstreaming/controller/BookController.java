package com.BookWave.bookstreaming.controller;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.LoginRequest;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.service.BookService;
import com.BookWave.bookstreaming.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;


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
