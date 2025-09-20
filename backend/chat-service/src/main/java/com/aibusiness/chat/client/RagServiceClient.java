package com.aibusiness.chat.client;

import com.aibusiness.chat.dto.RagQueryRequest;
import com.aibusiness.chat.dto.RagQueryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// The name "rag-service" must match the spring.application.name in the RAG service's config
@FeignClient(name = "rag-service")
public interface RagServiceClient {

    @PostMapping("/api/v1/rag/query")
    RagQueryResponse queryRag(@RequestBody RagQueryRequest request);
}

