package com.BookWave.bookstreaming.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.ReadingList;
import com.BookWave.bookstreaming.service.ReadingListService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/list")
public class ReadingListController {

    @Autowired
    private ReadingListService readingListService;

    @GetMapping("/user/{userId}")
    public List<ReadingList> getUserLists(@PathVariable Long userId) {
        return readingListService.getUserLists(userId);
    }

    @PostMapping
    public ReadingList createList(@RequestBody ReadingList listDTO) {
        if (!readingListService.canCreateMoreLists(listDTO.getUser().getId())) {
            return null;
        }
        
        return readingListService.createList(listDTO);
    }

    @PostMapping("/{listId}/books")
    public ReadingList addBookToList(
            @PathVariable Long listId,
            @RequestBody Book bookRequest) {
                return readingListService.addBookToList(listId, bookRequest.getId());
    }
}