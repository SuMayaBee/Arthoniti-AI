package com.aibusiness.docs.client;

import com.aibusiness.docs.dto.LogoGenerationRequest;
import com.aibusiness.docs.dto.LogoGenerationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// The name "logo-generator" is the spring.application.name of the target service
@FeignClient(name = "logo-generator")
public interface LogoServiceClient {

    // The method signature and mapping must match the endpoint in LogoController
    @PostMapping("/api/v1/logos/generate")
    LogoGenerationResponse generateLogo(@RequestBody LogoGenerationRequest request);
}
