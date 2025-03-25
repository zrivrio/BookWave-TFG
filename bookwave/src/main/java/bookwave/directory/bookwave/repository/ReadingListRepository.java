package bookwave.directory.bookwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import bookwave.directory.bookwave.domain.ReadingList;

@Repository
public interface ReadingListRepository extends JpaRepository<ReadingList, Long> {
}
