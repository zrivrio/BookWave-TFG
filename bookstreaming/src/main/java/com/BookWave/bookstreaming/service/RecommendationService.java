package com.BookWave.bookstreaming.service;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.domain.ReadingProgress;
import com.BookWave.bookstreaming.domain.Category;
import com.BookWave.bookstreaming.repository.BookRepository;
import com.BookWave.bookstreaming.repository.ReadingProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ReadingProgressRepository readingProgressRepository;

    public List<Book> getPersonalizedRecommendations(User user, int limit) {
        // Get user's reading history
        List<ReadingProgress> readingHistory = readingProgressRepository.findByUserId(user.getId());
        
        // Extract favorite categories based on reading history
        Map<Category, Long> categoryFrequency = readingHistory.stream()
            .map(progress -> progress.getBook().getCategories())
            .flatMap(Set::stream)
            .collect(Collectors.groupingBy(category -> category, Collectors.counting()));

        // Sort categories by frequency
        List<Category> favoriteCategories = categoryFrequency.entrySet().stream()
            .sorted(Map.Entry.<Category, Long>comparingByValue().reversed())
            .limit(3)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        // Get books from favorite categories that user hasn't read yet
        Set<Book> readBooks = readingHistory.stream()
            .map(ReadingProgress::getBook)
            .collect(Collectors.toSet());

        List<Book> recommendations = new ArrayList<>();
        for (Category category : favoriteCategories) {
            List<Book> categoryBooks = bookRepository.findByCategories(category).stream()
                .filter(book -> !readBooks.contains(book))
                .collect(Collectors.toList());
            recommendations.addAll(categoryBooks);
        }

        // Shuffle and limit recommendations
        Collections.shuffle(recommendations);
        return recommendations.stream()
            .limit(limit)
            .collect(Collectors.toList());
    }

    public List<Book> getPopularBooks(int limit) {
        // Get all books and sort them by a combination of readCount and reading list appearances
        List<Book> allBooks = bookRepository.findAll();
        
        return allBooks.stream()
            .sorted((b1, b2) -> {
                int readCountCompare = b2.getReadCount().compareTo(b1.getReadCount());
                if (readCountCompare != 0) {
                    return readCountCompare;
                }
                // If readCount is equal, compare by number of reading lists
                return Integer.compare(
                    b2.getReadingLists().size(),
                    b1.getReadingLists().size()
                );
            })
            .limit(limit)
            .collect(Collectors.toList());
    }

    public List<Book> getSimilarBooks(Book book, int limit) {
        Set<Category> bookCategories = book.getCategories();
        return bookRepository.findByCategories(bookCategories.iterator().next()).stream()
            .filter(b -> !b.equals(book))
            .limit(limit)
            .collect(Collectors.toList());
    }
}