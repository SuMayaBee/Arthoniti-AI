package com.aibusiness.presentation.repository;

import com.aibusiness.presentation.entity.PresentationImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PresentationImageRepository extends JpaRepository<PresentationImage, Long> {
    List<PresentationImage> findByPresentationId(Long presentationId);
}
