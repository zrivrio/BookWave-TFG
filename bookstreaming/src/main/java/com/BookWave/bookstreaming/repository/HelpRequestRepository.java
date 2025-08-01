package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.HelpRequest;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HelpRequestRepository extends JpaRepository<HelpRequest, Long> {
    List<HelpRequest> findByUserId(Long userId);
}
