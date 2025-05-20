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
        // Verificar si ya existe una categoría con el mismo nombre
        if (categoryRepository.findByNombre(category.getNombre()) != null) {
            throw new RuntimeException("Ya existe una categoría con este nombre");
        }
        
        // Asegurarse de que el ID sea null para una nueva categoría
        category.setId(null);
        
        // Inicializar la colección de libros si es null
        if (category.getBooks() == null) {
            category.setBooks(new HashSet<>());
        }
        
        return categoryRepository.save(category);
    }

    public void deleteCategoryById(long id) {
       this.categoryRepository.deleteById(id);
    }

    public Category updateCategory(Category category) {
        Category existingCategory = categoryRepository.findById(category.getId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Actualizar solo el nombre, no tocar la colección de libros
        existingCategory.setNombre(category.getNombre());
        
        // Guardar sin modificar la relación books
        Category updated = categoryRepository.save(existingCategory);
        
        // Devuelve una categoría "limpia" sin la colección books
        Category response = new Category();
        response.setId(updated.getId());
        response.setNombre(updated.getNombre());
        
        return response;
    }
}