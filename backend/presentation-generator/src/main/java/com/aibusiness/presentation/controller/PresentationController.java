package com.aibusiness.presentation.controller;

import com.aibusiness.presentation.dto.UnifiedGenerationRequest;
import com.aibusiness.presentation.dto.UnifiedGenerationResponse;
import com.aibusiness.presentation.service.PresentationService;
import com.aibusiness.presentation.entity.Presentation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/v1/presentation")
@RequiredArgsConstructor
public class PresentationController {

    private final PresentationService presentationService;

    @PostMapping(value = "/generate-unified", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UnifiedGenerationResponse> generateUnified(
            // Manually mapping form fields to a DTO
            @RequestParam("slides_count") Integer slidesCount,
            @RequestParam("prompt") String prompt,
            @RequestParam(value = "color_theme", required = false) String colorTheme,
            @RequestParam(value = "website_urls", required = false) String websiteUrls,
            @RequestParam(value = "industry_sector", required = false) String industrySector,
            // ... other form fields
            @RequestParam("user_id") Long userId,
            @RequestParam(value = "generate_images", defaultValue = "false") boolean generateImages,
            @RequestParam(value = "context_files", required = false) List<MultipartFile> contextFiles
    ) {
        UnifiedGenerationRequest request = UnifiedGenerationRequest.builder()
                .slidesCount(slidesCount)
                .prompt(prompt)
                .colorTheme(colorTheme)
                .websiteUrls(websiteUrls)
                .industrySector(industrySector)
                // ... map other fields
                .userId(userId)
                .generateImages(generateImages)
                .contextFiles(contextFiles)
                .build();
        
        UnifiedGenerationResponse response = presentationService.generateUnifiedPresentation(request);
        return ResponseEntity.ok(response);
    }
    
    // --- Outline Generation ---
    @PostMapping("/outline")
    public ResponseEntity<String> generateOutline(@RequestBody OutlineRequest req) {
        String outline = presentationService.generateOutline(req.getPrompt(), req.getNumberOfCards(), req.getLanguage());
        return ResponseEntity.ok(outline);
    }

    // --- Slide Generation ---
    @PostMapping("/generate")
    public ResponseEntity<String> generateSlides(@RequestBody SlideGenRequest req) {
        String xml = presentationService.generateSlides(req.getTitle(), req.getOutline(), req.getLanguage(), req.getTone());
        return ResponseEntity.ok(xml);
    }

    // --- CRUD ---
    @PostMapping("/create")
    public ResponseEntity<Presentation> createPresentation(@RequestBody Presentation p) {
        return ResponseEntity.ok(presentationService.createPresentation(p));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Presentation> getPresentation(@PathVariable Long id) {
        return ResponseEntity.ok(presentationService.getPresentationById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Presentation> updatePresentation(@PathVariable Long id, @RequestBody Presentation p) {
        return ResponseEntity.ok(presentationService.updatePresentation(id, p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePresentation(@PathVariable Long id) {
        presentationService.deletePresentation(id);
        return ResponseEntity.ok().body("Presentation deleted successfully");
    }

    @GetMapping("/user-id/{userId}")
    public ResponseEntity<List<Presentation>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(presentationService.getPresentationsByUserId(userId));
    }

    // DTOs for outline and slide gen
    public static class OutlineRequest {
        private String prompt;
        private int numberOfCards;
        private String language;
        // getters/setters
        public String getPrompt() { return prompt; }
        public void setPrompt(String p) { this.prompt = p; }
        public int getNumberOfCards() { return numberOfCards; }
        public void setNumberOfCards(int n) { this.numberOfCards = n; }
        public String getLanguage() { return language; }
        public void setLanguage(String l) { this.language = l; }
    }
    public static class SlideGenRequest {
        private String title;
        private List<String> outline;
        private String language;
        private String tone;
        // getters/setters
        public String getTitle() { return title; }
        public void setTitle(String t) { this.title = t; }
        public List<String> getOutline() { return outline; }
        public void setOutline(List<String> o) { this.outline = o; }
        public String getLanguage() { return language; }
        public void setLanguage(String l) { this.language = l; }
        public String getTone() { return tone; }
        public void setTone(String t) { this.tone = t; }
    }
}

