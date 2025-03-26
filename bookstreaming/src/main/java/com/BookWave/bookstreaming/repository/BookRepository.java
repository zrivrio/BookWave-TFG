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

   // Recommended books for user (books not in progress and not in any reading list)
   @Query("SELECT b FROM Book b " +
          "WHERE b.id NOT IN (SELECT rp.book.id FROM ReadingProgress rp WHERE rp.user.id = :userId) " +
          "AND b.id NOT IN (SELECT rlb.id FROM ReadingList rl JOIN rl.books rlb WHERE rl.user.id = :userId) " +
          "ORDER BY COALESCE(b.averageRating, 0) DESC")
   List<Book> findRecommendedBooksForUser(@Param("userId") Long userId);

   // Books in user's reading lists
   @Query("SELECT rlb FROM ReadingList rl JOIN rl.books rlb WHERE rl.user.id = :userId")
   List<Book> findBooksByUserId(@Param("userId") Long userId);
}
