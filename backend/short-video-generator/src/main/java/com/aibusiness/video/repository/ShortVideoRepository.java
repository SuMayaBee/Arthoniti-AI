package com.aibusiness.video.repository;

import com.aibusiness.video.entity.ShortVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ShortVideoRepository extends JpaRepository<ShortVideo, Long> {
    List<ShortVideo> findByUserId(Long userId);
}
