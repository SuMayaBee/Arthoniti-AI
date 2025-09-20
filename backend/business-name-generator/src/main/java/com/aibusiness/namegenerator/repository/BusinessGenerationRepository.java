package com.aibusiness.namegenerator.repository;

import com.aibusiness.namegenerator.entity.BusinessGeneration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusinessGenerationRepository extends JpaRepository<BusinessGeneration, Long> {
    // Spring Data JPA automatically creates the query from the method name
    List<BusinessGeneration> findByUserIdOrderByCreatedAtDesc(Long userId);
}
