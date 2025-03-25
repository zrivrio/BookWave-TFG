package bookwave.directory.bookwave.controller;

import bookwave.directory.bookwave.domain.ReadingList;
import bookwave.directory.bookwave.service.ReadingListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reading-lists")
public class ReadingListController {
    private final ReadingListService readingListService;

    @Autowired
    public ReadingListController(ReadingListService readingListService) {
        this.readingListService = readingListService;
    }

    @GetMapping
    public List<ReadingList> getAllReadingLists() {
        return readingListService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReadingList> getReadingListById(@PathVariable Long id) {
        return readingListService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ReadingList createReadingList(@RequestBody ReadingList readingList) {
        return readingListService.save(readingList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReadingList> updateReadingList(@PathVariable Long id, @RequestBody ReadingList readingList) {
        return readingListService.findById(id)
                .map(existingReadingList -> {
                    readingList.setId(id);
                    return ResponseEntity.ok(readingListService.save(readingList));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReadingList(@PathVariable Long id) {
        if (readingListService.findById(id).isPresent()) {
            readingListService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}