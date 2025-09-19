package com.aibusiness.presentation.controller;

import com.aibusiness.presentation.dto.PresentationGenerationRequest;
import com.aibusiness.presentation.dto.PresentationGenerationResponse;
import com.aibusiness.presentation.service.PresentationService;
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
@RequestMapping("/api/v1/presentations")
@RequiredArgsConstructor
public class PresentationController {

    private final PresentationService presentationService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/generate")
    public ResponseEntity<PresentationGenerationResponse> generatePresentation(@RequestBody PresentationGenerationRequest request) {
        try {
            String presId = presentationService.generatePresentation(request);
            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/v1/presentations/")
                    .path(presId)
                    .toUriString();

            return ResponseEntity.ok(new PresentationGenerationResponse("Presentation created successfully.", presId, downloadUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(new PresentationGenerationResponse("Failed to create presentation.", null, null));
        }
    }

    @GetMapping("/{presentationId}")
    public ResponseEntity<Resource> downloadPresentation(@PathVariable String presentationId) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(presentationId).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"") // inline to view in browser
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
