package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.ReadingProgress;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {
    Optional<ReadingProgress> findByUserIdAndBookId(Long userId, Long bookId);

    @Query("SELECT rp FROM ReadingProgress rp WHERE rp.user.id = :userId")
    List<ReadingProgress> findBooksByUserId(Long userId);
}
