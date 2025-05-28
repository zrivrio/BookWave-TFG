package com.BookWave.bookstreaming.controller;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.ReadingList;
import com.BookWave.bookstreaming.domain.User;
import com.BookWave.bookstreaming.service.ReadingListService;
import com.BookWave.bookstreaming.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/list")
public class ReadingListController {
    
    @Autowired
    private ReadingListService readingListService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReadingList>> getUserLists(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<ReadingList> lists = readingListService.getUserReadingLists(userId);
        return ResponseEntity.ok(lists);
    }

    @PostMapping("/create")
public ResponseEntity<?> createList(@RequestBody Map<String, Object> payload) {
    try {
        String name = payload.containsKey("name") ? payload.get("name").toString() : null;
        Long userId = payload.containsKey("userId") ? Long.valueOf(payload.get("userId").toString()) : null;
        
        if (name == null || userId == null) {
            return ResponseEntity.badRequest().body("Se requieren 'name' y 'userId'");
        }
        
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        
        ReadingList newList = readingListService.createReadingList(name, user);
        return ResponseEntity.ok(newList);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    @DeleteMapping("/{listId}")
    public ResponseEntity<?> deleteList(
            @PathVariable Long listId,
            @RequestParam Long userId) {
        
        try {
            readingListService.deleteReadingList(listId, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{listId}/books")
    public ResponseEntity<List<Book>> getBooksInList(@PathVariable Long listId) {
        ReadingList list = readingListService.getReadingListById(listId);
        if (list == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list.getBooks().stream().toList());
    }

    @PostMapping("/{listId}/add-book")
    public ResponseEntity<?> addBookToList(
            @PathVariable Long listId,
            @RequestParam Long bookId,
            @RequestParam Long userId) {
        
        try {
            readingListService.addBookToList(listId, bookId, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{listId}/remove-book")
    public ResponseEntity<?> removeBookFromList(
            @PathVariable Long listId,
            @RequestParam Long bookId,
            @RequestParam Long userId) {
        
        try {
            readingListService.removeBookFromList(listId, bookId, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //Métodos de Administrador
    @GetMapping("/admin")
    public List<ReadingList> getAllReadingLists() {
        return readingListService.getAllReadingLists();
    }

    @GetMapping("/admin/{id}")
    public ReadingList getReadingListByIdAdmin(@PathVariable Long id) {
        return readingListService.getReadingListByIdAdmin(id);
    }

    @PostMapping("/admin")
    public ReadingList saveReadingList(@RequestBody ReadingList readingList) {
        return readingListService.saveReadingList(readingList);
    }

    @DeleteMapping("/admin/{id}")
    public void deleteReadingList(@PathVariable Long id) {
        readingListService.deleteReadingListById(id);
    }

    @PutMapping("/admin")
    public ReadingList updateReadingList(@RequestBody ReadingList readingList) {
        return readingListService.updateReadingList(readingList);
    }
}