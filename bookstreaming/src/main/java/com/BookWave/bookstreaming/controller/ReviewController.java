package com.BookWave.bookstreaming.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.BookWave.bookstreaming.domain.Review;
import com.BookWave.bookstreaming.service.ReviewService;
import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.service.BookService;
import com.BookWave.bookstreaming.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private BookService bookService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/book/{bookId}")
    public List<Review> getReviewsByBook(@PathVariable Long bookId) {
        return reviewService.getReviewsByBook(bookId);
    }

    @PostMapping
    public Review createReview(@RequestBody Review review) {
        if (review.getBookid() == null) {
            throw new IllegalArgumentException("Book ID cannot be null");
        }
        if (review.getUserid() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        Book book = bookService.getBookById(review.getBookid());
        User user = userService.getUserById(review.getUserid());

        if (book == null) {
            throw new RuntimeException("Book not found with id: " + review.getBookid());
        }
        if (user == null) {
            throw new RuntimeException("User not found with id: " + review.getUserid());
        }

        review.setBook(book);
        review.setUser(user);

        return reviewService.createReview(review);
    }

    @PutMapping("/{id}")
    public Review updateReview(@PathVariable Long id, @RequestBody Review review) {
        return reviewService.updateReview(id, review);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }


}