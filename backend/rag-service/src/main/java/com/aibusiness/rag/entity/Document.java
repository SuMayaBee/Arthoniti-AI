package com.aibusiness.rag.entity;

import com.pgvector.PGvector;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    // The 'vector(384)' part specifies the dimension of the vector.
    // This dimension MUST match the output dimension of your embedding model.
    // Example dimensions: text-embedding-ada-002 (1536), all-MiniLM-L6-v2 (384).
    @Column(columnDefinition = "vector(384)")
    private PGvector embedding;
}
