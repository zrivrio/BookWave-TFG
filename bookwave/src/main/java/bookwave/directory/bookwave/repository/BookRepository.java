package bookwave.directory.bookwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import bookwave.directory.bookwave.domain.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

}
