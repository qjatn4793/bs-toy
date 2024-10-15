package com.example.demo.webbuilder.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.webbuilder.entity.NavLink;
import com.example.demo.webbuilder.entity.Website;
import com.example.demo.webbuilder.repository.WebsiteRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/websites")
@AllArgsConstructor
@Slf4j
public class WebsiteController {
    
    private final WebsiteRepository websiteRepository;
    
    // 웹사이트 목록 가져오기
    @GetMapping("/{userId}")
    public List<Website> getWebsitesByUserId(@PathVariable("userId") String userId) {
        log.info("Fetching websites for userId: {}", userId); // 사용자 ID로 웹사이트 조회 시작
        List<Website> websites = websiteRepository.findByUserId(userId);
        log.info("Found {} websites for userId: {}", websites.size(), userId); // 조회된 웹사이트 수
        return websites;
    }

    // 웹사이트 ID로 세부 정보 가져오기
    @GetMapping("/detail/{websiteId}")
    public ResponseEntity<Website> getWebsiteById(@PathVariable("websiteId") Long websiteId) {
        log.info("Fetching website details for websiteId: {}", websiteId); // 웹사이트 ID로 조회 시작
        Website website = websiteRepository.findById(websiteId).orElse(null);
        
        if (website == null) {
            log.warn("Website not found for websiteId: {}", websiteId); // 웹사이트가 없을 경우 경고
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 404 반환
        }
        
        log.info("Found website details: {}", website); // 웹사이트 세부 정보
        return ResponseEntity.ok(website); // 웹사이트 세부 정보를 반환
    }

    // 웹사이트 저장
    @PostMapping("/save")
    public ResponseEntity<Website> saveWebsite(@RequestBody Website website) {
        log.info("Saving website: {}", website); // 웹사이트 저장 시작

        // 유효성 검사
        if (website.getUserId() == null || website.getUserName() == null || website.getWebsiteName() == null) {
            log.warn("Invalid website data: {}", website); // 잘못된 데이터 경고
            return ResponseEntity.badRequest().body(null); // 요청이 잘못된 경우
        }
        
        // 내비게이션 링크의 website 필드를 설정
        if (website.getNavLinks() != null) {
            for (NavLink navLink : website.getNavLinks()) {
                navLink.setWebsite(website); // 각 navLink의 website 설정
            }
        }
        
        Website savedWebsite = websiteRepository.save(website); // 웹사이트 저장
        log.info("Website saved successfully: {}", savedWebsite); // 웹사이트 저장 성공
        return ResponseEntity.status(HttpStatus.CREATED).body(savedWebsite); // 저장된 웹사이트 반환
    }
}
