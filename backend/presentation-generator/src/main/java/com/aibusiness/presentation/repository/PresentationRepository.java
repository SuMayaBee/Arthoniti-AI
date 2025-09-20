package com.aibusiness.presentation.repository;

import com.aibusiness.presentation.entity.Presentation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PresentationRepository extends JpaRepository<Presentation, Long> {
    List<Presentation> findByUserId(Long userId);
}
