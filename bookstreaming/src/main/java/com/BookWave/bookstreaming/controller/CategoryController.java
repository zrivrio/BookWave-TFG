package com.BookWave.bookstreaming.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.BookWave.bookstreaming.domain.Book;
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

}