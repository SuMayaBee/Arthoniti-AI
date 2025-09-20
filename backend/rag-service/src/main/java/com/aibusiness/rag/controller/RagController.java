package com.aibusiness.rag.controller;

import com.aibusiness.rag.dto.IngestResponse;
import com.aibusiness.rag.dto.IngestUrlRequest;
import com.aibusiness.rag.dto.QueryRequest;
import com.aibusiness.rag.dto.QueryResponse;
import com.aibusiness.rag.service.RagPipelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/v1/rag")
@RequiredArgsConstructor
public class RagController {
    private final RagPipelineService ragPipelineService;

    @PostMapping(value = "/ingest/file", consumes = "multipart/form-data")
    public ResponseEntity<IngestResponse> ingestFile(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ragPipelineService.ingestFile(file));
    }

    @PostMapping("/ingest/url")
    public ResponseEntity<IngestResponse> ingestUrl(@RequestBody IngestUrlRequest request) {
        return ResponseEntity.ok(ragPipelineService.ingestUrl(request.getUrl()));
    }

    @PostMapping("/query")
    public ResponseEntity<QueryResponse> query(@RequestBody QueryRequest request) {
        return ResponseEntity.ok(ragPipelineService.query(request.getQuery()));
    }
}

