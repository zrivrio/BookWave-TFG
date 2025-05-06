package com.BookWave.bookstreaming.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.Category;
import com.BookWave.bookstreaming.service.CategoryService;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/names")
    public List<Map<String, Object>> getAllCategoryName() {
        return categoryService.getAllCategoryNames();
    }

    @GetMapping("/{id}")
    public List<Book> getBookByCategory(@PathVariable int id) {
        return categoryService.getBooksByCategory(id);
    }

    //Métodos de Administrador
    @GetMapping("/admin")
    public List<Category> getAllCategories() {
        return categoryService.gCategories();
    }

    @GetMapping("/admin/{id}")
    public Category getCategoryById(@PathVariable long id) {
        return categoryService.gCategoryById(id);
    }

    @PostMapping("/admin")
    public Category saveCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @DeleteMapping("/admin/{id}")
    public void deleteCategory(@PathVariable long id) {
        categoryService.deleteCategoryById(id);
    }

    @PutMapping("/admin")
    public Category updateCategory(@RequestBody Category category) {
        return categoryService.updateCategory(category);
    }
}