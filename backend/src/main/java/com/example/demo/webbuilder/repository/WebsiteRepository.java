package com.example.demo.webbuilder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.webbuilder.entity.Website;

public interface WebsiteRepository extends JpaRepository<Website, Long> {
    List<Website> findByUserId(String userId);
}