package com.aibusiness.website.controller;

import com.aibusiness.website.dto.WebsiteGenerationRequest;
import com.aibusiness.website.dto.WebsiteGenerationResponse;
import com.aibusiness.website.service.WebsiteService;
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
@RequestMapping("/api/v1/websites")
@RequiredArgsConstructor
public class WebsiteController {

    private final WebsiteService websiteService;

    @Value("${file.publish-dir}")
    private String publishDir;

    @PostMapping("/generate")
    public ResponseEntity<WebsiteGenerationResponse> generateWebsite(@RequestBody WebsiteGenerationRequest request) {
        try {
            String siteId = websiteService.generateWebsite(request);
            String previewUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/v1/websites/view/")
                    .path(siteId)
                    .toUriString();

            return ResponseEntity.ok(new WebsiteGenerationResponse("Website generated successfully.", siteId, previewUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(new WebsiteGenerationResponse("Failed to generate website.", null, null));
        }
    }

    @GetMapping(value = "/view/{siteId}")
    public ResponseEntity<Resource> viewWebsite(@PathVariable String siteId) {
        try {
            Path filePath = Paths.get(publishDir).resolve(siteId).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.TEXT_HTML)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
