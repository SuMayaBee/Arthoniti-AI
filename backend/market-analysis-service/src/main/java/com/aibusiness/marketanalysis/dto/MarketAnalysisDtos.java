package com.aibusiness.marketanalysis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import java.util.List;
import java.util.Map;

public class MarketAnalysisDtos {

    public record AnalysisRequest(
            @NotNull @JsonProperty("user_id") Long userId,
            @NotBlank String sector,
            @NotBlank String idea,
            @NotBlank String location
    ) {}

    // Represents the full, structured JSONB report
    @Builder
    public record AnalysisReport(
            MarketSummary marketSummary,
            MarketSize marketSize,
            List<CompetitorProfile> competitors,
            SwotAnalysis swot,
            PestleAnalysis pestle,
            PortersFiveForces porters,
            List<String> marketTrends,
            List<String> marketGaps,
            List<String> strategicRecommendations
    ) {}

    // --- Sub-records for the AnalysisReport ---
    public record MarketSummary(String overview, String keyFindings) {}
    public record MarketSize(String tam, String sam, String som, String projections) {}
    public record CompetitorProfile(String name, String description, String strengths, String weaknesses, String marketPosition) {}
    public record SwotAnalysis(List<String> strengths, List<String> weaknesses, List<String> opportunities, List<String> threats) {}
    public record PestleAnalysis(String political, String economic, String social, String technological, String legal, String environmental) {}
    public record PortersFiveForces(String threatOfNewEntrants, String bargainingPowerOfBuyers, String bargainingPowerOfSuppliers, String threatOfSubstitutes, String industryRivalry) {}

    // DTO for streaming events
    public record StreamEvent(
            String type, // e.g., "status", "result", "error"
            String message,
            Object data // Can hold partial or final results
    ) {}
}
