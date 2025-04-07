package com.BookWave.bookstreaming.repository;
import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.ReadingList;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    long countByUserId(Long userId);

}
