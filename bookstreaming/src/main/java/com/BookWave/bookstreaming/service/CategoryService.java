package com.BookWave.bookstreaming.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BookWave.bookstreaming.domain.Category;
import com.BookWave.bookstreaming.repository.BookRepository;
import com.BookWave.bookstreaming.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BookRepository bookRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAllWithBooks(); // Use the optimized query
    }
    
    public List<String> getAllCategoryNames() {
        return categoryRepository.findAllCategoryName();
    }
    




}