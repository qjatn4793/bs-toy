package com.example.demo.webbuilder.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Website {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    
    private String userName;
    
    private String websiteName;
    
    private LocalDateTime regDate;

    @OneToMany(mappedBy = "website", cascade = CascadeType.ALL, orphanRemoval = true) // 연관 관계 설정
    @JsonManagedReference // 직렬화 시 이 쪽만 처리
    private List<NavLink> navLinks = new ArrayList<>(); // 내비게이션 링크 리스트
    
    // 생성자에서 regDate를 현재 시간으로 설정
    public Website() {
        this.regDate = LocalDateTime.now();
    }
}