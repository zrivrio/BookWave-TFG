package com.BookWave.bookstreaming.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.repository.BookRepository;
import com.BookWave.bookstreaming.repository.ReadingListRepository;

@Service
public class RecommendationService {

    @Autowired
    private ReadingListRepository readingListRepository;

    @Autowired
    private BookRepository bookRepository;

    public Book getMostPopularBook() {
        return readingListRepository.findMostPopularBook();
    }

    public List<Book> getPersonalizedRecommendations(Long userId) {
        return bookRepository.findRecommendedBooksForUser(userId);
    }

    public List<Book> getRandomBooks() {
        return bookRepository.findRandomBooks();
    }




}