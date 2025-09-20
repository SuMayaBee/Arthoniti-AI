package com.aibusiness.logo.controller;

import com.aibusiness.logo.dto.*;
import com.aibusiness.logo.entity.Logo;
import com.aibusiness.logo.service.LogoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/logo")
@RequiredArgsConstructor
public class LogoController {

    private final LogoService logoService;

    @PostMapping("/design")
    public ResponseEntity<LogoResponse> createLogoDesign(@RequestBody LogoDesignRequest request) throws IOException {
        LogoResponse response = logoService.createLogo(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/remove_bg")
    public ResponseEntity<RemoveBgResponse> removeLogoBackground(@RequestBody RemoveBgRequest request) {
        try {
            Logo updatedLogo = logoService.removeBackground(request);
            return ResponseEntity.ok(new RemoveBgResponse(true, updatedLogo.getId(), updatedLogo.getRemoveBgLogoImageUrl(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new RemoveBgResponse(false, request.getLogoId(), null, "Failed to remove background: " + e.getMessage()));
        }
    }

    @GetMapping("/{logo_id}")
    public ResponseEntity<LogoResponse> getLogoById(@PathVariable("logo_id") Long logoId) {
        return ResponseEntity.ok(logoService.getLogoById(logoId));
    }

    @GetMapping("/user/{user_id}")
    public ResponseEntity<List<LogoResponse>> getUserLogos(@PathVariable("user_id") Long userId) {
        return ResponseEntity.ok(logoService.getLogosByUserId(userId));
    }

    @DeleteMapping("/{logo_id}")
    public ResponseEntity<MessageResponse> deleteLogo(@PathVariable("logo_id") Long logoId) {
        logoService.deleteLogo(logoId);
        return ResponseEntity.ok(new MessageResponse("Logo deleted successfully"));
    }

    // Note: The design-only endpoint is not included as the primary create endpoint now fulfills this by storing the design in the 'content' field.
    // If it were a distinct feature, you would add another method here calling a specific service method.
}

