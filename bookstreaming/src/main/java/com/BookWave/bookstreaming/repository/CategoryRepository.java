package com.BookWave.bookstreaming.repository;

import java.util.List;
import java.util.Map;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.BookWave.bookstreaming.domain.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @EntityGraph(attributePaths = {"books"})
    @Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.books")
    List<Category> findAllWithBooks();
    
    @Query("SELECT DISTINCT new map(c.id as id, c.nombre as nombre) FROM Category c")
    List<Map<String, Object>> findAllCategoryName();

    String findByNombre(String nombre);

}
