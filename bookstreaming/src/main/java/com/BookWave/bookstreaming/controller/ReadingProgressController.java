package com.BookWave.bookstreaming.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.ReadingProgress;
import com.BookWave.bookstreaming.service.ReadingProgressService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/reading-progress")
public class ReadingProgressController {
    @Autowired
    private ReadingProgressService readingProgressService;

    @GetMapping("/user/{userId}/books")
    public List<Book> getBooksInProgress(@PathVariable Long userId) {
        return readingProgressService.getBooksInProgress(userId);
    }

    @GetMapping("/user/{userId}/book/{bookId}")
    public ReadingProgress getReadingProgress(
            @PathVariable Long userId,
            @PathVariable Long bookId) {
        return readingProgressService.getReadingProgress(userId, bookId);
    }

    @PostMapping
    public ReadingProgress createReadingProgress(
            @RequestBody ReadingProgress progress) {
        return readingProgressService.saveReadingProgress(progress);

    }

    @PutMapping("/{id}")
    public ReadingProgress updateReadingProgress(
            @PathVariable Long id,
            @RequestBody ReadingProgress progress) {
        progress.setId(id);
        return readingProgressService.saveReadingProgress(progress);
    }

    @DeleteMapping("/{id}")
    public void deleteReadingProgress(@PathVariable Long id) {
        readingProgressService.deleteReadingProgress(id);
    }

}