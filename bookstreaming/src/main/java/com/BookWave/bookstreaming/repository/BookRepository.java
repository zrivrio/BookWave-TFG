package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.Book;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

   // Books in progress for a user (through ReadingProgress)
   @Query("SELECT rp.book FROM ReadingProgress rp WHERE rp.user.id = :userId AND rp.percentageRead > 0")
   List<Book> findBooksInProgressByUserId(@Param("userId") Long userId);

  

   // Sirve

   @Query(value = """
    SELECT * FROM books 
    ORDER BY RAND() 
    LIMIT 10
""", nativeQuery = true)
List<Book> findRandomBooks();

   @Query(value = """
    WITH UserCategories AS (
        -- Obtener las categorías de los libros que el usuario ya tiene
        SELECT DISTINCT c.id
        FROM category c
        JOIN category_book cb ON c.id = cb.category_id
        JOIN reading_list_books rlb ON cb.book_id = rlb.book_id
        JOIN reading_lists rl ON rlb.reading_list_id = rl.id
        WHERE rl.user_id = :userId
    ),
    RecommendedBooks AS (
        -- Libros que comparten categorías con los del usuario
        SELECT b.*,
               COUNT(DISTINCT cb.category_id) AS matching_categories,
               RAND() AS random_order
        FROM books b
        JOIN category_book cb ON b.id = cb.book_id
        WHERE cb.category_id IN (SELECT id FROM UserCategories)
        AND b.id NOT IN (
            -- Excluir libros que el usuario ya tiene
            SELECT DISTINCT rlb.book_id
            FROM reading_list_books rlb
            JOIN reading_lists rl ON rlb.reading_list_id = rl.id
            WHERE rl.user_id = :userId
        )
        GROUP BY b.id
    )
    SELECT * FROM RecommendedBooks
    ORDER BY matching_categories DESC, random_order
    LIMIT 10
""", nativeQuery = true)
List<Book> findRecommendedBooksForUser(@Param("userId") Long userId);
}
