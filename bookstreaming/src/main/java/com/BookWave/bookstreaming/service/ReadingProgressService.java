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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
                    ReadingProgress newProgress = new ReadingProgress();
                    newProgress.setUser(userRepository.findById(userId).orElseThrow());
                    newProgress.setBook(bookRepository.findById(bookId).orElseThrow());
                    newProgress.setCurrentPage(0);
                    newProgress.setPercentageRead(0.0);
                    return readingProgressRepository.save(newProgress);
                });
    }

    public ReadingProgress saveReadingProgress(ReadingProgress progress) {
        User usuario = userRepository.findById(progress.getUser().getId()).orElseThrow();
        Book book = bookRepository.findById(progress.getBook().getId()).orElseThrow();
    
        if (book.getTotalPages() != null && book.getTotalPages() > 0) {
            double percentage = (double) progress.getCurrentPage() / book.getTotalPages() * 100;
            progress.setPercentageRead(Math.min(percentage, 100));
        } else {
            progress.setPercentageRead(0.0);
        }
    
        Optional<ReadingProgress> existingProgress = readingProgressRepository
                .findByUserIdAndBookId(usuario.getId(), book.getId());
    
        if (existingProgress.isPresent()) {
            ReadingProgress toUpdate = existingProgress.get();
            toUpdate.setCurrentPage(progress.getCurrentPage());
            toUpdate.setPercentageRead(progress.getPercentageRead());
            return readingProgressRepository.save(toUpdate);
        }
        return readingProgressRepository.save(progress);
    }

    public void deleteReadingProgress(Long id) {
        readingProgressRepository.deleteById(id);
    }

    public List<Book> getBooksInProgress(Long userId) {
        return readingProgressRepository.findBooksByUserId(userId)
                .stream()
                .map(ReadingProgress::getBook)
                .collect(Collectors.toList());
    }

    //Métodos de Administrador
    public List<ReadingProgress> getAllReadingProgress() {
        return readingProgressRepository.findAll();
    }

    public ReadingProgress getReadingProgressById(Long id) {
        return readingProgressRepository.findById(id).orElse(null);
    }

    public ReadingProgress createReadingProgress(ReadingProgress readingProgress) {
        return readingProgressRepository.save(readingProgress);
    }

    public ReadingProgress updateReadingProgress(ReadingProgress readingProgress) {
        return readingProgressRepository.save(readingProgress);
    }
}