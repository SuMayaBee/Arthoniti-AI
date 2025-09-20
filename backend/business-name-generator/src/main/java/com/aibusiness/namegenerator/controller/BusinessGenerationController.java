package com.aibusiness.namegenerator.controller;

import com.aibusiness.namegenerator.dto.BusinessGenerationListResponse;
import com.aibusiness.namegenerator.dto.BusinessGenerationRequest;
import com.aibusiness.namegenerator.dto.BusinessGenerationResponse;
import com.aibusiness.namegenerator.dto.MessageResponse;
import com.aibusiness.namegenerator.service.BusinessGenerationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/business-generation")
@RequiredArgsConstructor
public class BusinessGenerationController {

    private final BusinessGenerationService service;

    // Use @ModelAttribute to bind form-data to a POJO
    @PostMapping("/generate-simple")
    public ResponseEntity<BusinessGenerationResponse> generateSimple(@Valid @ModelAttribute BusinessGenerationRequest request) {
        BusinessGenerationResponse response = service.generateAndSaveNames(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{user_id}")
    public ResponseEntity<BusinessGenerationListResponse> getUserGenerations(@PathVariable("user_id") Long userId) {
        return ResponseEntity.ok(service.getGenerationsByUserId(userId));
    }

    @GetMapping("/{generation_id}")
    public ResponseEntity<BusinessGenerationResponse> getGenerationById(@PathVariable("generation_id") Long generationId) {
        return ResponseEntity.ok(service.getGenerationById(generationId));
    }

    @DeleteMapping("/{generation_id}")
    public ResponseEntity<MessageResponse> deleteGeneration(@PathVariable("generation_id") Long generationId) {
        service.deleteGeneration(generationId);
        return ResponseEntity.ok(new MessageResponse("Business generation " + generationId + " deleted successfully"));
    }
}
