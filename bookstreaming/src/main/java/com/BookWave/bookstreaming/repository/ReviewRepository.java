package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.Review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBookid(Long bookId); // Changed from findByBookId to findByBookid to match entity field name
}
