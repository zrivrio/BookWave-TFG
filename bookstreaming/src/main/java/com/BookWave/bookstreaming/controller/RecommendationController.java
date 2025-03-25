package com.BookWave.bookstreaming.controller;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/personalized/{userId}")
    public ResponseEntity<List<Book>> getPersonalizedRecommendations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        User user = new User();
        user.setId(userId);
        return ResponseEntity.ok(recommendationService.getPersonalizedRecommendations(user, limit));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Book>> getPopularBooks(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.getPopularBooks(limit));
    }

    @GetMapping("/similar/{bookId}")
    public ResponseEntity<List<Book>> getSimilarBooks(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "5") int limit) {
        Book book = new Book();
        book.setId(bookId);
        return ResponseEntity.ok(recommendationService.getSimilarBooks(book, limit));
    }
}