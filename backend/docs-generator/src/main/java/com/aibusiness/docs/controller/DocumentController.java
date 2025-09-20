package com.aibusiness.docs.controller;

import com.aibusiness.docs.dto.*;
import com.aibusiness.docs.entity.DocumentType;
import com.aibusiness.docs.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService docService;
    
    // --- Business Proposal Endpoints ---
    @PostMapping("/business-proposal")
    public ResponseEntity<DocumentResponse> createBusinessProposal(@Valid @RequestBody BusinessProposalRequest request) {
        return ResponseEntity.ok(docService.createBusinessProposal(request));
    }
    
    @GetMapping("/business-proposal/{id}")
    public ResponseEntity<DocumentResponse> getBusinessProposal(@PathVariable Long id) {
        return ResponseEntity.ok(docService.getDocumentById(id));
    }

    @GetMapping("/business-proposal/user/{userId}")
    public ResponseEntity<List<DocumentResponse>> getUserBusinessProposals(@PathVariable Long userId) {
        return ResponseEntity.ok(docService.getDocumentsByUserAndType(userId, DocumentType.BUSINESS_PROPOSAL));
    }
    
    @PutMapping("/business-proposal/{id}")
    public ResponseEntity<DocumentResponse> updateBusinessProposal(@PathVariable Long id, @Valid @RequestBody UpdateContentRequest request) {
        return ResponseEntity.ok(docService.updateContent(id, request));
    }

    @PostMapping("/upload/business-proposal/{id}")
    public ResponseEntity<UploadResponse> uploadBusinessProposal(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(docService.uploadFile(id, DocumentType.BUSINESS_PROPOSAL, file));
    }

    @DeleteMapping("/business-proposal/{id}")
    public ResponseEntity<DeleteResponse> deleteBusinessProposal(@PathVariable Long id) {
        docService.deleteDocument(id);
        return ResponseEntity.ok(new DeleteResponse("Business proposal deleted successfully", id));
    }

    @DeleteMapping("/business-proposal/user/{userId}/all")
    public ResponseEntity<Map<String, Object>> deleteAllUserBusinessProposals(@PathVariable Long userId) {
        long count = docService.deleteAllUserDocumentsByType(userId, DocumentType.BUSINESS_PROPOSAL);
        return ResponseEntity.ok(Map.of(
            "message", "Deleted " + count + " business proposals for user " + userId,
            "user_id", userId,
            "deleted_count", count
        ));
    }

    // --- Partnership Agreement Endpoints ---
    @PostMapping("/partnership-agreement")
    public ResponseEntity<DocumentResponse> createPartnershipAgreement(@Valid @RequestBody PartnershipAgreementRequest request) {
        return ResponseEntity.ok(docService.createPartnershipAgreement(request));
    }

    // ... Other endpoints for Partnership Agreement, NDA, etc., would follow the same CRUD pattern ...


    // --- Bulk Delete All ---
    @DeleteMapping("/user/{userId}/all")
    public ResponseEntity<BulkDeleteResponse> deleteAllUserDocuments(@PathVariable Long userId) {
        return ResponseEntity.ok(docService.deleteAllUserDocuments(userId));
    }
}
