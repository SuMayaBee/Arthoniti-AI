package com.aibusiness.marketanalysis.service;

import com.aibusiness.marketanalysis.dto.MarketAnalysisDtos.*;
import com.aibusiness.marketanalysis.entity.MarketAnalysis;
import com.aibusiness.marketanalysis.exception.AnalysisNotFoundException;
import com.aibusiness.marketanalysis.repository.MarketAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class MarketAnalysisService {

    private final MarketAnalysisRepository repository;
    private final MarketAiAgentService aiAgentService;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    public SseEmitter generateAnalysisStream(AnalysisRequest request) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        executor.execute(() -> {
            MarketAnalysis analysis = null;
            try {
                // 1. Create and save the initial record
                analysis = MarketAnalysis.builder()
                        .userId(request.userId())
                        .sector(request.sector())
                        .idea(request.idea())
                        .location(request.location())
                        .status("IN_PROGRESS")
                        .build();
                analysis = repository.save(analysis);
                sendEvent(emitter, "status", "Analysis started.", analysis.getId());

                // 2. Perform the long-running AI analysis
                AnalysisReport report = aiAgentService.generateFullAnalysis(request.sector(), request.idea(), request.location());
                sendEvent(emitter, "status", "Analysis complete. Saving results.", null);

                // 3. Update the record with the final report
                analysis.setReport(report);
                analysis.setStatus("COMPLETED");
                analysis.setUpdatedAt(ZonedDateTime.now());
                repository.save(analysis);

                // 4. Send the final result and complete the stream
                sendEvent(emitter, "result", "Analysis finished successfully.", report);
                emitter.send(SseEmitter.event().name("complete").data("[DONE]"));
                emitter.complete();

            } catch (Exception e) {
                // Handle errors: update DB and send error event
                if (analysis != null) {
                    analysis.setStatus("FAILED");
                    repository.save(analysis);
                }
                sendEvent(emitter, "error", "Analysis failed: " + e.getMessage(), null);
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }

    private void sendEvent(SseEmitter emitter, String type, String message, Object data) {
        try {
            emitter.send(SseEmitter.event().name(type).data(new StreamEvent(type, message, data)));
        } catch (IOException e) {
            // Emitter might be closed by the client
        }
    }

    @Transactional(readOnly = true)
    public List<MarketAnalysis> getAnalysesForUser(Long userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public MarketAnalysis getAnalysisById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new AnalysisNotFoundException("Analysis with ID " + id + " not found."));
    }
}
