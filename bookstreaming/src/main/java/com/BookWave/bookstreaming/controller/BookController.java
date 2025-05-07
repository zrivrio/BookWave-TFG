package com.BookWave.bookstreaming.controller;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping("/progress/{userId}")
    public List<Book> getBooksInProgress(@PathVariable Long userId) {
        return bookService.getBooksInProgressByUserId(userId);
    }

    @GetMapping("/search/{searchTerm}")
    public List<Book> getBooksBySearch(@PathVariable String searchTerm) {
        return bookService.getBooksBySearch(searchTerm);
    }

    //Administrador
    @GetMapping({"", "/"})
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable String id) {
        try {
            Long bookId = Long.parseLong(id);
            Book book = bookService.getBookById(bookId);
            if (book == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(book);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid book ID format");
        }
    }

    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookService.saveBook(book);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        return bookService.updateBook(book);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable int id) {
        bookService.deleteBookById(id);
    }
}
