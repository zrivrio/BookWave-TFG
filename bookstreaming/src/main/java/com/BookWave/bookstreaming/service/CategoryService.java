package com.BookWave.bookstreaming.service;
import java.util.HashSet;
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


    //Metodos Usuarios
    public List<Map<String, Object>> getAllCategoryNames() {
        return categoryRepository.findAllCategoryName();
    }

    public List<Book> getBooksByCategory(int id) {
        return bookRepository.findByCategory(id);
    }

    //Metodos Admin
    public List<Category> gCategories() {
        return categoryRepository.findAll();
    }

    public Category gCategoryById(long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategoryById(long id) {
       this.categoryRepository.deleteById(id);
    }

    public Category updateCategory(Category category) {
        Category existingCategory = categoryRepository.findById(category.getId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Update basic properties
        existingCategory.setNombre(category.getNombre());
        
        // Safely handle books collection
        if (category.getBooks() != null) {
            existingCategory.setBooks(new HashSet<>(category.getBooks()));
        }
        
        return categoryRepository.save(existingCategory);
    }
}