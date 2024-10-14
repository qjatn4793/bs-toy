package com.example.demo.webbuilder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.webbuilder.entity.NavLink;

@Repository
public interface NavLinkRepository extends JpaRepository<NavLink, Long> {
}