package com.BookWave.bookstreaming.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.ReadingList;
import com.BookWave.bookstreaming.repository.BookRepository;
import com.BookWave.bookstreaming.repository.ReadingListRepository;

@Service
public class RecommendationService {

    @Autowired
    private ReadingListRepository readingListRepository;
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserService userService;

    public Book getMostPopularBook() {
        return readingListRepository.findMostPopularBook();
    }

    public List<Book> getPersonalizedRecommendations(Long userId) {
        // 1. Obtener listas de lectura del usuario
        List<ReadingList> userLists = readingListRepository.findByUserId(userId);

        // 2. Obtener libros que el usuario ya tiene en sus listas
        Set<Book> userBooks = userLists.stream()
                .flatMap(list -> bookRepository.findBooksByReadingListId(list.getId()).stream())
                .collect(Collectors.toSet());

        // 3. Obtener otras listas de lectura que contengan estos libros
        Set<ReadingList> relatedLists = new HashSet<>();
        for (Book book : userBooks) {
            List<ReadingList> listsContainingBook = book.getReadingLists();
            relatedLists.addAll(listsContainingBook);
        }

        // 4. Obtener libros de esas listas (sin repetir)
        Set<Book> recommendedBooks = relatedLists.stream()
                .flatMap(list -> bookRepository.findBooksByReadingListId(list.getId()).stream())
                .collect(Collectors.toSet());

        // 5. Filtrar los libros que el usuario ya tiene
        recommendedBooks.removeAll(userBooks);

        // 6. Devolver una lista con un máximo de 10 recomendaciones
        return recommendedBooks.stream().limit(10).collect(Collectors.toList());
    }



}