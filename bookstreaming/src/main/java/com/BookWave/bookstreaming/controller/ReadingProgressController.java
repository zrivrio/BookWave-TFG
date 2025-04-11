package com.BookWave.bookstreaming.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.BookWave.bookstreaming.domain.ReadingProgress;
import com.BookWave.bookstreaming.service.ReadingProgressService;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/reading-progress")
public class ReadingProgressController {
    @Autowired
    private ReadingProgressService readingProgressService;

    @GetMapping("/user/{userId}/book/{bookId}")
    public ResponseEntity<ReadingProgress> getReadingProgress(
            @PathVariable Long userId, 
            @PathVariable Long bookId) {
        ReadingProgress progress = readingProgressService.getReadingProgress(userId, bookId);
        return ResponseEntity.ok(progress);
    }

    @PostMapping
    public ResponseEntity<ReadingProgress> createReadingProgress(
            @RequestBody ReadingProgress progress) {
        ReadingProgress savedProgress = readingProgressService.saveReadingProgress(progress);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProgress);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReadingProgress> updateReadingProgress(
            @PathVariable Long id, 
            @RequestBody ReadingProgress progress) {
        progress.setId(id);
        ReadingProgress updatedProgress = readingProgressService.saveReadingProgress(progress);
        return ResponseEntity.ok(updatedProgress);
    }

}