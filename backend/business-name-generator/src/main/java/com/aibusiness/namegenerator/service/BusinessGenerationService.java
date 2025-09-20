package com.aibusiness.namegenerator.service;

import com.aibusiness.namegenerator.dto.BusinessGenerationRequest;
import com.aibusiness.namegenerator.dto.BusinessGenerationListResponse;
import com.aibusiness.namegenerator.dto.BusinessGenerationResponse;
import com.aibusiness.namegenerator.entity.BusinessGeneration;
import com.aibusiness.namegenerator.exception.BusinessGenerationNotFoundException;
import com.aibusiness.namegenerator.repository.BusinessGenerationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessGenerationService {

    private final BusinessGenerationRepository repository;
    private final NameAiService nameAiService;

    @Transactional
    public BusinessGenerationResponse generateAndSaveNames(BusinessGenerationRequest request) {
        // 1. Call the AI service to get the names
        List<String> generatedNames = nameAiService.generateNames(request);

        // 2. Build the entity to save to the database
        BusinessGeneration generation = BusinessGeneration.builder()
                .userId(request.getUserId())
                .nameTone(request.getNameTone())
                .industry(request.getIndustry())
                .prompts(request.getPrompts())
                .noOfNames(request.getNoOfNames())
                .generatedNames(generatedNames)
                .build();

        // 3. Save the entity and get the persisted version
        BusinessGeneration savedGeneration = repository.save(generation);

        // 4. Map the saved entity to a response DTO and return
        return mapToResponse(savedGeneration);
    }

    public BusinessGenerationResponse getGenerationById(Long id) {
        return repository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new BusinessGenerationNotFoundException("Business generation with ID " + id + " not found"));
    }

    public BusinessGenerationListResponse getGenerationsByUserId(Long userId) {
        List<BusinessGeneration> generations = repository.findByUserIdOrderByCreatedAtDesc(userId);
        List<BusinessGenerationResponse> responses = generations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new BusinessGenerationListResponse(responses, responses.size());
    }

    @Transactional
    public void deleteGeneration(Long id) {
        if (!repository.existsById(id)) {
            throw new BusinessGenerationNotFoundException("Business generation with ID " + id + " not found");
        }
        repository.deleteById(id);
    }

    private BusinessGenerationResponse mapToResponse(BusinessGeneration entity) {
        return new BusinessGenerationResponse(
                entity.getId(),
                entity.getGeneratedNames(),
                entity.getUserId(),
                entity.getNameTone(),
                entity.getIndustry(),
                entity.getNoOfNames(),
                entity.getCreatedAt()
        );
    }
}
