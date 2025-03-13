package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.ReadingList;
import com.BookWave.bookstreaming.domain.ReadingProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadinProgressRepository extends JpaRepository<ReadingProgress, Integer> {
}
