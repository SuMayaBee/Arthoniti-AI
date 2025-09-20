package com.aibusiness.marketanalysis.controller;

import com.aibusiness.marketanalysis.dto.MarketAnalysisDtos.AnalysisRequest;
import com.aibusiness.marketanalysis.entity.MarketAnalysis;
import com.aibusiness.marketanalysis.service.MarketAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/market-analysis")
@RequiredArgsConstructor
public class MarketAnalysisController {

    private final MarketAnalysisService analysisService;

    @PostMapping("/business-analysis")
    public SseEmitter generateBusinessAnalysis(@Valid @RequestBody AnalysisRequest request) {
        return analysisService.generateAnalysisStream(request);
    }

    @GetMapping("/analyses/user/{userId}")
    public ResponseEntity<List<MarketAnalysis>> getUserAnalyses(@PathVariable Long userId) {
        return ResponseEntity.ok(analysisService.getAnalysesForUser(userId));
    }

    @GetMapping("/analyses/{analysisId}")
    public ResponseEntity<MarketAnalysis> getAnalysisById(@PathVariable UUID analysisId) {
        return ResponseEntity.ok(analysisService.getAnalysisById(analysisId));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "healthy", "service", "market-analysis-service"));
    }
}
