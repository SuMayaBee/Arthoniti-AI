package com.aibusiness.presentation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "presentation_images")
public class PresentationImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "presentation_id", nullable = false)
    private Long presentationId;

    @Column(name = "image_url", nullable = false, length = 2048)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String prompt;

    private String filename;
    private String model;
    private String size;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;
}
