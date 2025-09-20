package com.aibusiness.chat.repository;

import com.aibusiness.chat.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUserIdAndIsActiveTrueOrderByUpdatedAtDesc(Long userId);
    @Query("SELECT s FROM ChatSession s LEFT JOIN FETCH s.messages WHERE s.id = :sessionId AND s.userId = :userId")
    Optional<ChatSession> findByIdAndUserIdWithMessages(Long sessionId, Long userId);
}
