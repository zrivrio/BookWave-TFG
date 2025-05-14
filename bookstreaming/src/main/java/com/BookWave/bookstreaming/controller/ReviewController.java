package com.BookWave.bookstreaming.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.BookWave.bookstreaming.domain.Review;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.service.ReviewService;
import com.BookWave.bookstreaming.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/book/{bookId}")
    public List<Review> getReviewsByBook(@PathVariable Long bookId) {
        List<Review> reviews = reviewService.getReviewsByBook(bookId);
        reviews.forEach(review -> {
            User user = userService.getUserById(review.getUser().getId());
            review.setUser(user);
        });
        return reviews;
    }

    @GetMapping("/book/{bookId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByBook(@PathVariable Long bookId) {
        Double average = reviewService.getAverageRatingByBook(bookId);
        return ResponseEntity.ok(average != null ? average : 0.0);
    }

    @GetMapping
    public List<Review> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        reviews.forEach(review -> {
            User user = userService.getUserById(review.getUser().getId());
            review.setUser(user);
        });
        return reviews;
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        try {
            User user = userService.getUserById(review.getUser().getId());
            review.setUser(user);
            Review savedReview = reviewService.createReview(review);
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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