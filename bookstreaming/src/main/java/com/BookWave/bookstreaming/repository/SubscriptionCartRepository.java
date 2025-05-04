package com.BookWave.bookstreaming.repository;

import com.BookWave.bookstreaming.domain.SubscriptionCart;
import com.BookWave.bookstreaming.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SubscriptionCartRepository extends JpaRepository<SubscriptionCart, Long> {
    Optional<SubscriptionCart> findByUser(User user);
}
