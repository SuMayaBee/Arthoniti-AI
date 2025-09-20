package com.aibusiness.logo.repository;

import com.aibusiness.logo.entity.Logo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogoRepository extends JpaRepository<Logo, Long> {
    List<Logo> findByUserId(Long userId);
}
