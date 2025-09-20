package com.aibusiness.docs.service;

import com.aibusiness.docs.dto.*;
import com.aibusiness.docs.entity.Document;
import com.aibusiness.docs.entity.DocumentType;
import com.aibusiness.docs.exception.DocumentNotFoundException;
import com.aibusiness.docs.repository.DocumentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentAiService documentAiService;
    private final StorageService storageService;
    private final ObjectMapper objectMapper;

    // --- Generic Document Creation ---
    private DocumentResponse createDocument(DocumentType type, String prompt, BaseDocumentRequest request) {
        String content = documentAiService.generateDocumentContent(prompt, request);
        Document doc = Document.builder()
                .userId(request.getUserId())
                .documentType(type)
                .aiGeneratedContent(content)
                .inputData(request)
                .build();
        return mapToResponse(documentRepository.save(doc));
    }
    
    // --- Business Proposal Methods ---
    public DocumentResponse createBusinessProposal(BusinessProposalRequest request) {
        return createDocument(DocumentType.BUSINESS_PROPOSAL, DocumentAiService.getBusinessProposalPrompt(), request);
    }
    
    // --- Partnership Agreement Methods ---
     public DocumentResponse createPartnershipAgreement(PartnershipAgreementRequest request) {
        return createDocument(DocumentType.PARTNERSHIP_AGREEMENT, DocumentAiService.getPartnershipAgreementPrompt(), request);
    }
    
    // ... Methods for creating NDA, Contract, etc. would follow ...

    // --- Generic CRUD Methods ---
    public DocumentResponse getDocumentById(Long id) {
        return documentRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + id));
    }

    public List<DocumentResponse> getDocumentsByUserAndType(Long userId, DocumentType type) {
        return documentRepository.findByUserIdAndDocumentType(userId, type).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DocumentResponse updateContent(Long id, UpdateContentRequest request) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + id));
        doc.setAiGeneratedContent(request.getAiGeneratedContent());
        return mapToResponse(documentRepository.save(doc));
    }

    @Transactional
    public UploadResponse uploadFile(Long id, DocumentType type, MultipartFile file) throws IOException {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + id));
        
        String subfolder = type.name().toLowerCase();
        String baseName = subfolder + "_" + id;
        String fileUrl = storageService.uploadFile(file, subfolder, baseName);
        
        doc.setDocsUrl(fileUrl);
        documentRepository.save(doc);

        return new UploadResponse(true, id, fileUrl, null);
    }

    @Transactional
    public void deleteDocument(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new DocumentNotFoundException("Document not found with ID: " + id);
        }
        documentRepository.deleteById(id);
    }

    @Transactional
    public long deleteAllUserDocumentsByType(Long userId, DocumentType type) {
        return documentRepository.deleteByUserIdAndDocumentType(userId, type);
    }

    @Transactional
    public BulkDeleteResponse deleteAllUserDocuments(Long userId) {
        Map<String, Long> counts = new HashMap<>();
        for (DocumentType type : DocumentType.values()) {
            long count = documentRepository.countByUserIdAndDocumentType(userId, type);
            if (count > 0) {
                counts.put(type.name().toLowerCase() + "s", count);
            }
        }
        long totalDeleted = documentRepository.deleteByUserId(userId);
        String message = String.format("Successfully deleted %d documents for user %d", totalDeleted, userId);
        return new BulkDeleteResponse(message, userId, counts, totalDeleted);
    }
    
    // --- Helper ---
    private DocumentResponse mapToResponse(Document doc) {
        DocumentResponse res = new DocumentResponse();
        res.setId(doc.getId());
        res.setUserId(doc.getUserId());
        res.setAiGeneratedContent(doc.getAiGeneratedContent());
        res.setDocsUrl(doc.getDocsUrl());
        res.setCreatedAt(doc.getCreatedAt());
        res.setUpdatedAt(doc.getUpdatedAt());
        try {
            res.setInputData(objectMapper.writeValueAsString(doc.getInputData()));
        } catch (JsonProcessingException e) {
            res.setInputData("{}"); // Fallback
        }
        return res;
    }
}
