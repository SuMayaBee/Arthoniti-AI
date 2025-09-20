package com.aibusiness.logo.entity;

import com.aibusiness.logo.config.JsonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.ZonedDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "logos")
public class Logo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "logo_title", nullable = false)
    private String logoTitle;

    @Column(name = "logo_vision")
    private String logoVision;

    @Column(name = "color_palette_name")
    private String colorPaletteName;

    @Column(name = "logo_style")
    private String logoStyle;

    @Column(name = "logo_image_url", length = 2048)
    private String logoImageUrl;

    @Column(name = "remove_bg_logo_image_url", length = 2048)
    private String removeBgLogoImageUrl;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> content;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;
}
