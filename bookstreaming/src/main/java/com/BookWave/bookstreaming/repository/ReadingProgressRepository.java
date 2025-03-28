package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.ReadingProgress;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {
    List<ReadingProgress> findByUserId(Long userId);
}
