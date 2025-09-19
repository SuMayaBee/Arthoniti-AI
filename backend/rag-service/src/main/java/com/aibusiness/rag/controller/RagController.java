package com.aibusiness.rag.controller;

import com.aibusiness.rag.dto.IngestRequest;
import com.aibusiness.rag.dto.QueryRequest;
import com.aibusiness.rag.dto.QueryResponse;
import com.aibusiness.rag.service.RagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/rag")
@RequiredArgsConstructor
public class RagController {

    private final RagService ragService;

    @PostMapping("/ingest")
    public ResponseEntity<Void> ingestDocument(@RequestBody IngestRequest request) {
        ragService.ingestDocument(request.getContent());
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    @PostMapping("/query")
    public ResponseEntity<QueryResponse> query(@RequestBody QueryRequest request) {
        QueryResponse response = ragService.query(request.getQuery());
        return ResponseEntity.ok(response);
    }
}
