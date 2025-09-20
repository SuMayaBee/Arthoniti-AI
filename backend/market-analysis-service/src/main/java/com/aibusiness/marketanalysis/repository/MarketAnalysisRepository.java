package com.aibusiness.marketanalysis.repository;

import com.aibusiness.marketanalysis.entity.MarketAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MarketAnalysisRepository extends JpaRepository<MarketAnalysis, UUID> {
    List<MarketAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId);
}
