package bookwave.directory.bookwave.service;

import bookwave.directory.bookwave.domain.ReadingList;
import bookwave.directory.bookwave.repository.ReadingListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReadingListService {
    private final ReadingListRepository readingListRepository;

    @Autowired
    public ReadingListService(ReadingListRepository readingListRepository) {
        this.readingListRepository = readingListRepository;
    }

    public List<ReadingList> findAll() {
        return readingListRepository.findAll();
    }

    public Optional<ReadingList> findById(Long id) {
        return readingListRepository.findById(id);
    }

    public ReadingList save(ReadingList readingList) {
        return readingListRepository.save(readingList);
    }

    public void deleteById(Long id) {
        readingListRepository.deleteById(id);
    }
}