package com.aibusiness.namegenerator.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "business_generations")
public class BusinessGeneration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "name_tone", nullable = false, length = 100)
    private String nameTone;

    @Column(nullable = false, length = 200)
    private String industry;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String prompts;

    @Column(name = "no_of_names", nullable = false)
    private Integer noOfNames;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "business_generations", joinColumns = @JoinColumn(name = "id"))
    @Column(name = "generated_names", nullable = false)
    private List<String> generatedNames;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;
}
