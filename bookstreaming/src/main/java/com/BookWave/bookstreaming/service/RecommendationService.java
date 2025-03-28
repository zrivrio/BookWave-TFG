package com.BookWave.bookstreaming.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.repository.ReadingListRepository;

@Service
public class RecommendationService {

    @Autowired
    private ReadingListRepository readingListRepository;

    public Book getMostPopularBook() {
        return readingListRepository.findMostPopularBook();
    }


}