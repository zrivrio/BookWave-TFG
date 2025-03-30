package com.BookWave.bookstreaming.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.Category;
import com.BookWave.bookstreaming.repository.BookRepository;
import com.BookWave.bookstreaming.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BookRepository bookRepository;
    
    public List<Map<String, Object>> getAllCategoryNames() {
        return categoryRepository.findAllCategoryName();
    }

    // public List<Book> getBooksByCategory(String categoryName) {
    //     String category = categoryRepository.findByNombre(categoryName);
    //     if (category != null) {
    //         return bookRepository.findByCategory(category);
    //     }
    //     return List.of();
    // }


    




}