package com.aibusiness.video.controller;

import com.aibusiness.video.dto.VideoGenerationRequest;
import com.aibusiness.video.dto.VideoGenerationResponse;
import com.aibusiness.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

@RestController
@RequestMapping("/api/v1/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;
    private static final Logger log = LoggerFactory.getLogger(VideoController.class);

    @PostMapping("/generate")
    public DeferredResult<ResponseEntity<VideoGenerationResponse>> generateVideo(@RequestBody VideoGenerationRequest request) {
        log.info("Received video generation request.");

        // Create a DeferredResult that will hold the response. Timeout after 60 seconds.
        DeferredResult<ResponseEntity<VideoGenerationResponse>> deferredResult = new DeferredResult<>(60000L);

        // This is a timeout callback
        deferredResult.onTimeout(() ->
                deferredResult.setErrorResult(
                        ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT)
                                .body("Request timed out after 60 seconds.")
                ));

        // Call the async service method
        videoService.generateVideo(request.getScript(), request.getStyle(), request.getDurationSeconds())
                .whenComplete((videoUrl, throwable) -> {
                    if (throwable != null) {
                        deferredResult.setErrorResult(
                                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body("Error during video generation: " + throwable.getMessage())
                        );
                    } else {
                        VideoGenerationResponse response = new VideoGenerationResponse("Video processing complete.", videoUrl);
                        deferredResult.setResult(ResponseEntity.ok(response));
                    }
                });

        log.info("Request is being processed asynchronously. Returning DeferredResult.");
        return deferredResult;
    }
}
