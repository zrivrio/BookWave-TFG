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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
public class ReadingListService {
    
    @Autowired
    private ReadingListRepository readingListRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookRepository bookRepository;

    private static final int MAX_LISTS_FREE = 5;
    private static final int MAX_BOOKS_PER_LIST_FREE = 10;

    @Transactional(readOnly = true)
    public List<ReadingList> getUserReadingLists(Long userId) {
        log.info("Obteniendo listas de lectura para usuario: {}", userId);
        return readingListRepository.findByUser_Id(userId);
    }

    @Transactional
    public ReadingList createReadingList(String name, User user) {
        log.info("Creando nueva lista '{}' para usuario: {}", name, user.getId());
        
        if (user.getSubscriptionType() != SubscriptionType.Premium) {
            long listCount = readingListRepository.countByUserId(user.getId());
            if (listCount >= MAX_LISTS_FREE) {
                throw new RuntimeException("Límite de listas alcanzado. Actualiza a premium para crear más listas.");
            }
        }
        
        ReadingList newList = new ReadingList();
        newList.setName(name);
        newList.setUser(user);
        
        ReadingList savedList = readingListRepository.save(newList);
        log.info("Lista creada exitosamente con ID: {}", savedList.getId());
        return savedList;
    }

    @Transactional
    public void addBookToList(Long listId, Long bookId, Long userId) {
        log.info("Añadiendo libro {} a lista {} por usuario {}", bookId, listId, userId);
        
        ReadingList list = readingListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
        
        if (!list.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permiso para modificar esta lista");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        
        if (user.getSubscriptionType() != SubscriptionType.Premium && 
            list.getBooks().size() >= MAX_BOOKS_PER_LIST_FREE) {
            throw new RuntimeException("Límite de libros alcanzado. Actualiza a premium para añadir más libros.");
        }
        
        if (list.getBooks().contains(book)) {
            throw new RuntimeException("Este libro ya está en la lista");
        }
        
        list.addBook(book);
        
        readingListRepository.save(list);
        bookRepository.save(book);
        
        log.info("Libro {} añadido exitosamente a la lista {}", bookId, listId);
    }

    @Transactional
    public void deleteReadingList(Long listId, Long userId) {
        log.info("Eliminando lista {} por usuario {}", listId, userId);
        
        ReadingList list = readingListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
        
        if (!list.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permiso para eliminar esta lista");
        }

        for (Book book : list.getBooks()) {
            book.getReadingLists().remove(list);
        }
        list.getBooks().clear();
        
        readingListRepository.delete(list);
        log.info("Lista {} eliminada exitosamente", listId);
    }

    @Transactional(readOnly = true)
    public ReadingList getReadingListById(Long listId) {
        return readingListRepository.findById(listId).orElse(null);
    }

    @Transactional
    public void removeBookFromList(Long listId, Long bookId, Long userId) {
        log.info("Removiendo libro {} de lista {} por usuario {}", bookId, listId, userId);
        
        ReadingList list = readingListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
        
        if (!list.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permiso para modificar esta lista");
        }
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        list.removeBook(book);
        
        readingListRepository.save(list);
        bookRepository.save(book);
        
        log.info("Libro {} removido exitosamente de la lista {}", bookId, listId);
    }

    // Métodos de Administrador
    @Transactional(readOnly = true)
    public List<ReadingList> getAllReadingLists() {
        return readingListRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ReadingList getReadingListByIdAdmin(Long listId) {
        return readingListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Lista de lectura no encontrada"));
    }

    @Transactional
    public ReadingList saveReadingList(ReadingList readingList) {
        return readingListRepository.save(readingList);
    }

    @Transactional
    public void deleteReadingListById(Long listId) {
        readingListRepository.deleteById(listId);
    }

    @Transactional
    public ReadingList updateReadingList(ReadingList readingList) {
        if (!readingListRepository.existsById(readingList.getId())) {
            throw new RuntimeException("Lista de lectura no encontrada");
        }
        return readingListRepository.save(readingList);
    }
}