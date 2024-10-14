package com.example.demo.webbuilder.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class NavLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // 링크 이름
    private String path; // 링크 경로

    @ManyToOne
    @JoinColumn(name = "website_id", nullable = false) // 외래키 설정
    @JsonBackReference // 이 쪽은 직렬화 시 무시됨
    private Website website; // 해당 링크가 속한 웹사이트
}