package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.ReadingList;
import com.BookWave.bookstreaming.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
}
