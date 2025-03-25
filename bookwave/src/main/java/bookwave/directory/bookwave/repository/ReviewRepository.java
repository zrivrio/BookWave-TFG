package bookwave.directory.bookwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import bookwave.directory.bookwave.domain.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
}
