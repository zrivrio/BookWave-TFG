package com.BookWave.bookstreaming.service;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.ReadingList;
import com.BookWave.bookstreaming.domain.SubscriptionType;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.repository.BookRepository;
import com.BookWave.bookstreaming.repository.ReadingListRepository;
import com.BookWave.bookstreaming.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ReadingListService {
    
    @Autowired
    private ReadingListRepository readingListRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookRepository bookRepository;

    private static final int MAX_LISTS_FREE = 5;
    private static final int MAX_BOOKS_PER_LIST_FREE = 10;

    public List<ReadingList> getUserReadingLists(Long userId) {
        return readingListRepository.findByUserId(userId);
    }

    public ReadingList createReadingList(String name, User user) {
        if (user.getSubscriptionType() != SubscriptionType.Premium) {
            long listCount = readingListRepository.countByUserId(user.getId());
            if (listCount >= MAX_LISTS_FREE) {
                throw new RuntimeException("Límite de listas alcanzado. Actualiza a premium para crear más listas.");
            }
        }
        
        ReadingList newList = new ReadingList();
        newList.setName(name);
        newList.setUser(user);
        
        return readingListRepository.save(newList);
    }

    public void addBookToList(Long listId, Long bookId, Long userId) {
        ReadingList list = readingListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (user.getSubscriptionType() != SubscriptionType.Premium && 
            list.getBooks().size() >= MAX_BOOKS_PER_LIST_FREE) {
            throw new RuntimeException("Límite de libros alcanzado. Actualiza a premium para añadir más libros.");
        }
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        
        if (list.getBooks().contains(book)) {
            throw new RuntimeException("Este libro ya está en la lista");
        }
        
        list.getBooks().add(book);
        readingListRepository.save(list);
    }

    public void deleteReadingList(Long listId, Long userId) {
        ReadingList list = readingListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
        
        if (!list.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permiso para eliminar esta lista");
        }
        
        readingListRepository.delete(list);
    }

    public ReadingList getReadingListById(Long listId) {
        return readingListRepository.findById(listId).orElse(null);
    }

    public void removeBookFromList(Long listId, Long bookId, Long userId) {
        ReadingList list = readingListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
        
        if (!list.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permiso para modificar esta lista");
        }
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        
        list.getBooks().remove(book);
        readingListRepository.save(list);
    }
}