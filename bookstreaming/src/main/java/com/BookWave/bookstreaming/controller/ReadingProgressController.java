package com.BookWave.bookstreaming.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.BookWave.bookstreaming.domain.ReadingProgress;
import com.BookWave.bookstreaming.service.ReadingProgressService;

@RestController
@RequestMapping("/reading-progress")
public class ReadingProgressController {
    
    @Autowired
    private ReadingProgressService readingProgressService;
    
    @GetMapping("/in-progress")
    public ResponseEntity<List<ReadingProgress>> getInProgressBooks(
            @RequestParam Long userId) {  // Ahora es requerido
        List<ReadingProgress> progress = readingProgressService.getInProgressBooks(userId);
        return ResponseEntity.ok(progress);
    }
}
