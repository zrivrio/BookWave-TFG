package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.Book;
import com.BookWave.bookstreaming.domain.ReadingList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadinListRepository extends JpaRepository<ReadingList, Integer> {
}
