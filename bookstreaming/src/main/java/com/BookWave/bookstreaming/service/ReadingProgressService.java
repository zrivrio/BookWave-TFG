package com.BookWave.bookstreaming.service;


import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BookWave.bookstreaming.domain.ReadingProgress;
import com.BookWave.bookstreaming.repository.BookRepository;
import com.BookWave.bookstreaming.repository.ReadingProgressRepository;
import com.BookWave.bookstreaming.repository.UserRepository;

import java.util.Optional;

@Slf4j
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
        System.out.print("Consolaaaaaa:   " + progress);
        User usuario = userRepository.findById(progress.getUser().getId()).orElseThrow();
        Book book = bookRepository.findById(progress.getBook().getId()).orElseThrow();
        // Buscar progreso existente
        Optional<ReadingProgress> existingProgress = readingProgressRepository
                .findByUserIdAndBookId(usuario.getId(), book.getId());

        // Si existe, actualizarlo manteniendo el ID original
        if (existingProgress.isPresent()) {
            ReadingProgress toUpdate = existingProgress.get();
            toUpdate.setCurrentPage(progress.getCurrentPage());
            toUpdate.setPercentageRead(progress.getPercentageRead());
            return readingProgressRepository.save(toUpdate);
        }
        return readingProgressRepository.save(progress);
    }
}