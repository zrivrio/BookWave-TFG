package com.BookWave.bookstreaming.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.service.RecommendationService;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/popular")
    public Book getPopularBooks() {
        return recommendationService.getMostPopularBook();
    }

    @GetMapping("/books/{userId}")
    public List<Book> getRecommendedBooks(@PathVariable Long userId) {
        return recommendationService.getPersonalizedRecommendations(userId);
    }

    @GetMapping("/random")
    public List<Book> getRandomBooks() {
        return recommendationService.getRandomBooks();
    }

}