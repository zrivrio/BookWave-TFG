package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.Book;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

   // Libros de un usuario
   List<Book> findBooksByUserId(Long userId);


   // Libros recomendados para el usuario
   @Query("SELECT b FROM Book b WHERE b.id NOT IN " +
          "(SELECT rb.id FROM Book rb JOIN rb.users u WHERE u.id = :userId) " +
          "ORDER BY b.averageRating DESC")
   List<Book> findRecommendedBooksForUser(@Param("userId") Long userId);


   // Buscar libros en proceso de lectura por usuario
   @Query("SELECT b FROM Book b JOIN b.users u WHERE u.id = :userId AND b.readingProgress > 0")
   List<Book> findBooksInProgressByUserId(@Param("userId") Long userId);
}
