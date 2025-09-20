package com.aibusiness.website.entity;

import com.aibusiness.website.config.JsonbType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "projects")
public class Project {
    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String title;
    private String description;
    private String prompt;

    @Type(JsonbType.class)
    @Column(columnDefinition = "jsonb")
    private Object files;

    @Type(JsonbType.class)
    @Column(columnDefinition = "jsonb")
    private Object messages;

    @Column(name = "thumbnail_url")
    private String thumbnail;
    
    @Column(name = "deployed_url")
    private String deployedUrl;

    @Column(name = "deployed_at")
    private ZonedDateTime deployedAt;

    private String status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;
}
