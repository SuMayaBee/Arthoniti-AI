package com.aibusiness.chat.client;

import com.aibusiness.chat.dto.RagQueryRequest;
import com.aibusiness.chat.dto.RagQueryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// The name "rag-service" must match the spring.application.name of the RAG service.
// Feign will use Eureka to discover the actual host and port of the service.
@FeignClient(name = "rag-service")
public interface RagServiceClient {

    // This method signature must match the one in RagController
    @PostMapping("/api/v1/rag/query")
    RagQueryResponse queryRag(@RequestBody RagQueryRequest queryRequest);
}
