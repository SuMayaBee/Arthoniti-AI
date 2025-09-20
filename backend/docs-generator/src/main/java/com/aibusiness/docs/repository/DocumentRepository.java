package com.aibusiness.docs.repository;

import com.aibusiness.docs.entity.Document;
import com.aibusiness.docs.entity.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByUserIdAndDocumentType(Long userId, DocumentType documentType);

    long deleteByUserIdAndDocumentType(Long userId, DocumentType documentType);

    long deleteByUserId(Long userId);

    long countByUserIdAndDocumentType(Long userId, DocumentType documentType);

}
