package com.aibusiness.video.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "short_videos")
public class ShortVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String prompt;

    @Column(name = "video_url", length = 2048, nullable = false)
    private String videoUrl;

    @Column(name = "aspect_ratio", nullable = false)
    private String aspectRatio;

    @Column(name = "duration_seconds", nullable = false)
    private Integer duration;

    @Column(name = "audio_generation", nullable = false)
    private boolean audioGeneration;

    @Column(nullable = false)
    private boolean watermark;

    @Column(name = "person_generation", nullable = false)
    private String personGeneration;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;
}
