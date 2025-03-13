package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.Review;
import com.BookWave.bookstreaming.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
}
