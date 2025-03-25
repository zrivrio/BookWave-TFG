package bookwave.directory.bookwave.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import bookwave.directory.bookwave.domain.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
