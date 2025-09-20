package com.aibusiness.video.service;

import com.aibusiness.video.dto.ShortVideoResponse;
import com.aibusiness.video.dto.VideoGenerationRequest;
import com.aibusiness.video.entity.ShortVideo;
import com.aibusiness.video.exception.VideoNotFoundException;
import com.aibusiness.video.repository.ShortVideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShortVideoService {
    private final ShortVideoRepository videoRepository;
    private final VideoAiService aiService;
    private final StorageService storageService;

    @Transactional
    public ShortVideoResponse generateAndSaveVideo(VideoGenerationRequest request) {
        // 1. Call AI service to generate video data (returns Base64 string)
        String videoBase64 = aiService.generateVideo(request.getPrompt());

        // 2. Upload video data to GCS
        String baseFileName = request.getPrompt().replaceAll("[^a-zA-Z0-9]", "_").substring(0, Math.min(request.getPrompt().length(), 40));
        String videoUrl = storageService.uploadVideoFromBase64(videoBase64, baseFileName);

        // 3. Create entity with fixed settings from API docs
        ShortVideo video = ShortVideo.builder()
                .userId(request.getUserId())
                .prompt(request.getPrompt())
                .videoUrl(videoUrl)
                .aspectRatio("16:9")
                .duration(8)
                .audioGeneration(true)
                .watermark(false)
                .personGeneration("allow-all")
                .build();

        // 4. Save to database
        ShortVideo savedVideo = videoRepository.save(video);

        // 5. Map to response DTO
        return mapToResponse(savedVideo);
    }

    public List<ShortVideoResponse> getVideosByUserId(Long userId) {
        return videoRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ShortVideoResponse getVideoById(Long videoId) {
        return videoRepository.findById(videoId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new VideoNotFoundException("Short video not found"));
    }

    @Transactional
    public void deleteVideo(Long videoId) {
        if (!videoRepository.existsById(videoId)) {
            throw new VideoNotFoundException("Short video not found");
        }
        // In a real app, you would also delete the file from GCS here.
        videoRepository.deleteById(videoId);
    }

    private ShortVideoResponse mapToResponse(ShortVideo entity) {
        return new ShortVideoResponse(
                entity.getId(),
                entity.getUserId(),
                entity.getPrompt(),
                entity.getVideoUrl(),
                entity.getAspectRatio(),
                String.valueOf(entity.getDuration()), // Convert integer to string for response
                entity.isAudioGeneration(),
                entity.isWatermark(),
                entity.getPersonGeneration(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
