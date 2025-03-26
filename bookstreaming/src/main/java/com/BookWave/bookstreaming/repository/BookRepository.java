package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.Category;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Collection<Book> findByCategories(Category category);
}
