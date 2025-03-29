package com.BookWave.bookstreaming.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.BookWave.bookstreaming.service.CategoryService;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/names")
    public List<String> getAllCategoryName() {
        return categoryService.getAllCategoryNames();
    }

   

}