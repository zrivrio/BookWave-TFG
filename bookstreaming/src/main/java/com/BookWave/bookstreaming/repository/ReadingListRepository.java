package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.ReadingList;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadingListRepository extends JpaRepository<ReadingList, Long> {

    @Query(value = """
        SELECT b.* FROM books b
        JOIN reading_list_books rlb ON b.id = rlb.book_id
        GROUP BY b.id
        ORDER BY COUNT(rlb.reading_list_id) DESC
        LIMIT 1
    """, nativeQuery = true)
    Book findMostPopularBook();

    List<ReadingList> findByUserId(Long userId);
    
    @Query("SELECT COUNT(r) FROM ReadingList r WHERE r.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    // Método para encontrar listas con sus libros cargados
    @Query("SELECT DISTINCT r FROM ReadingList r LEFT JOIN FETCH r.books WHERE r.user.id = :userId")
    List<ReadingList> findByUserIdWithBooks(@Param("userId") Long userId);

}
