package com.BookWave.bookstreaming.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BookWave.bookstreaming.domain.ReadingProgress;
import com.BookWave.bookstreaming.repository.BookRepository;
import com.BookWave.bookstreaming.repository.ReadingProgressRepository;
import com.BookWave.bookstreaming.repository.UserRepository;

@Service
public class ReadingProgressService {
    @Autowired
    private ReadingProgressRepository readingProgressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    public ReadingProgress getReadingProgress(Long userId, Long bookId) {
        return readingProgressRepository.findByUserIdAndBookId(userId, bookId)
                .orElseGet(() -> {
                    // Si no existe, creamos uno nuevo con 0% de progreso
                    ReadingProgress newProgress = new ReadingProgress();
                    newProgress.setUser(userRepository.findById(userId).orElseThrow());
                    newProgress.setBook(bookRepository.findById(bookId).orElseThrow());
                    newProgress.setCurrentPage(0);
                    newProgress.setPercentageRead(0.0);
                    return readingProgressRepository.save(newProgress);
                });
    }

    public ReadingProgress saveReadingProgress(ReadingProgress progress) {
        // Validar que el porcentaje esté entre 0 y 100
        if (progress.getPercentageRead() < 0) {
            progress.setPercentageRead(0.0);
        } else if (progress.getPercentageRead() > 100) {
            progress.setPercentageRead(100.0);
        }

        // Calcular currentPage basado en el porcentaje (asumiendo que el libro tiene totalPages)
        if (progress.getBook() != null && progress.getBook().getTotalPages() != null) {
            int totalPages = progress.getBook().getTotalPages();
            progress.setCurrentPage((int) Math.round(progress.getPercentageRead() * totalPages / 100));
        }

        return readingProgressRepository.save(progress);
    }
}