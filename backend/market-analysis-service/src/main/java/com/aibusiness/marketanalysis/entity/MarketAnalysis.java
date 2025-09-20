package com.aibusiness.marketanalysis.entity;

import com.aibusiness.marketanalysis.dto.MarketAnalysisDtos;
import com.vladmihalcea.hibernate.type.json.JsonbType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "market_analyses")
public class MarketAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String sector;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String idea;

    @Column(nullable = false)
    private String location;

    @Type(JsonbType.class)
    @Column(columnDefinition = "jsonb")
    private MarketAnalysisDtos.AnalysisReport report;

    @Column(nullable = false)
    private String status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;
}
