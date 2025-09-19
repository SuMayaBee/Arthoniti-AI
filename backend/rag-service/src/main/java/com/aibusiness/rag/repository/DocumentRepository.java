package com.aibusiness.rag.repository;

import com.aibusiness.rag.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import com.pgvector.PGvector;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    // This is a native query that uses the cosine distance operator (<=>) from pgvector
    // to find the 'limit' number of documents closest to the given 'embedding'.
    @Query(value = "SELECT * FROM document ORDER BY embedding <=> :embedding LIMIT :limit", nativeQuery = true)
    List<Document> findNearestNeighbors(@Param("embedding") PGvector embedding, @Param("limit") int limit);
}
