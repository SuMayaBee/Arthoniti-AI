package com.aibusiness.video.controller;

import com.aibusiness.video.dto.MessageResponse;
import com.aibusiness.video.dto.ServiceStatusResponse;
import com.aibusiness.video.dto.ShortVideoResponse;
import com.aibusiness.video.dto.VideoGenerationRequest;
import com.aibusiness.video.service.ShortVideoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/short-video")
@RequiredArgsConstructor
public class ShortVideoController {
    private final ShortVideoService videoService;

    @PostMapping("/generate")
    public ResponseEntity<ShortVideoResponse> generateVideo(@Valid @RequestBody VideoGenerationRequest request) {
        return ResponseEntity.ok(videoService.generateAndSaveVideo(request));
    }

    @GetMapping("/{video_id}")
    public ResponseEntity<ShortVideoResponse> getVideoById(@PathVariable("video_id") Long videoId) {
        return ResponseEntity.ok(videoService.getVideoById(videoId));
    }

    @GetMapping("/user/{user_id}")
    public ResponseEntity<List<ShortVideoResponse>> getUserVideos(@PathVariable("user_id") Long userId) {
        return ResponseEntity.ok(videoService.getVideosByUserId(userId));
    }

    @DeleteMapping("/{video_id}")
    public ResponseEntity<MessageResponse> deleteVideo(@PathVariable("video_id") Long videoId) {
        videoService.deleteVideo(videoId);
        return ResponseEntity.ok(new MessageResponse("Short video deleted successfully"));
    }

    @GetMapping("/status/check")
    public ResponseEntity<ServiceStatusResponse> checkStatus() {
        // This is a static response as per the API docs.
        // A real health check would ping the Gemini API.
        Map<String, String> fixedSettings = Map.of(
                "aspect_ratio", "16:9",
                "duration", "8 seconds",
                "audio_generation", "Yes",
                "watermark", "No",
                "person_generation", "allow-all"
        );
        Map<String, String> requestFormat = Map.of(
                "user_id", "integer",
                "prompt", "string (required)"
        );

        ServiceStatusResponse status = new ServiceStatusResponse(
                "healthy",
                "Gemini Video Generation with Veo 3.0",
                "veo-3.0-generate-preview",
                "google.genai",
                fixedSettings,
                requestFormat,
                null
        );
        return ResponseEntity.ok(status);
    }
}
