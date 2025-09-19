package com.aibusiness.docs.controller;

import com.aibusiness.docs.dto.DocGenerationRequest;
import com.aibusiness.docs.dto.DocGenerationResponse;
import com.aibusiness.docs.service.DocService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/v1/docs")
@RequiredArgsConstructor
public class DocController {

    private final DocService docService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/generate")
    public ResponseEntity<DocGenerationResponse> generateDoc(@RequestBody DocGenerationRequest request) {
        try {
            String docId = docService.generateDocument(request);
            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/v1/docs/")
                    .path(docId)
                    .toUriString();

            return ResponseEntity.ok(new DocGenerationResponse("Document created successfully.", docId, downloadUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(new DocGenerationResponse("Failed to create document.", null, null));
        }
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<Resource> downloadDoc(@PathVariable String documentId) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(documentId).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
