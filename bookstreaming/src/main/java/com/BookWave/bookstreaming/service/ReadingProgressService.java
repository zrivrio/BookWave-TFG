package com.BookWave.bookstreaming.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BookWave.bookstreaming.domain.ReadingProgress;
import com.BookWave.bookstreaming.repository.ReadingProgressRepository;

@Service
public class ReadingProgressService {
    
    @Autowired
    private ReadingProgressRepository readingProgressRepository;
    
    public List<ReadingProgress> getInProgressBooks(Long userId) {  // Añade userId como parámetro
        if(userId != null) {
            return readingProgressRepository.findByUserIdAndCompletedFalse(userId);
        }
        return readingProgressRepository.findByCompletedFalse();
    }
}
