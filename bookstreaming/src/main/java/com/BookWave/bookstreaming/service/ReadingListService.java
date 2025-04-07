package com.BookWave.bookstreaming.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.ReadingList;
import com.BookWave.bookstreaming.domain.SubscriptionType;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.repository.BookRepository;
import com.BookWave.bookstreaming.repository.ReadingListRepository;
import com.BookWave.bookstreaming.repository.UserRepository;

@Service
public class ReadingListService {

    @Autowired
    private ReadingListRepository readingListRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    public List<ReadingList> getUserLists(Long userId) {
        return readingListRepository.findByUserId(userId);
    }

    public boolean canCreateMoreLists(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                
        if (user.getSubscriptionType() == SubscriptionType.Premium) {
            return true;
        }
        
        long listCount = readingListRepository.countByUserId(userId);
        return listCount < 5;
    }

    public ReadingList createList(ReadingList listDTO) {
        User user = userRepository.findById(listDTO.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        ReadingList newList = new ReadingList();
        newList.setName(listDTO.getName());
        newList.setUser(user);
        
        return readingListRepository.save(newList);
    }

    public ReadingList addBookToList(Long listId, Long bookId) {
        ReadingList list = readingListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
                
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        
        list.addBook(book);
        return readingListRepository.save(list);
    }
}