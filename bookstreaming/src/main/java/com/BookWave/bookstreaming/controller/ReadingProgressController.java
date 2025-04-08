package com.BookWave.bookstreaming.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.BookWave.bookstreaming.domain.ReadingProgress;
import com.BookWave.bookstreaming.domain.Review;
import com.BookWave.bookstreaming.service.ReadingProgressService;
import com.BookWave.bookstreaming.service.ReviewService;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/reading-progress")
public class ReadingProgressController {
    @Autowired
    private ReadingProgressService readingProgressService;

    @GetMapping("/user/{userId}/book/{bookId}")
    public ReadingProgress getReadingProgress(@PathVariable Long userId, @PathVariable Long bookId) {
        return readingProgressService.getReadingProgress(userId, bookId);
    }

    @PostMapping
    public ReadingProgress createOrUpdateReadingProgress(@RequestBody ReadingProgress progress) {
        return readingProgressService.saveReadingProgress(progress);
    }

    @PutMapping("/{id}")
    public ReadingProgress updateReadingProgress(@PathVariable Long id, @RequestBody ReadingProgress progress) {
        progress.setId(id);
        return readingProgressService.saveReadingProgress(progress);
    }

}