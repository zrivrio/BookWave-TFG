package com.BookWave.bookstreaming.controller;

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

}