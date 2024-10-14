package com.example.demo.webbuilder.controller;

import java.util.List;

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

@RestController
@RequestMapping("/api/websites")
@AllArgsConstructor
public class WebsiteController {
	
	private final WebsiteRepository websiteRepository;
	
	// 웹사이트 목록 가져오기
    @GetMapping("/{userId}")
    public List<Website> getWebsitesByUserId(@PathVariable("userId") String userId) {
        return websiteRepository.findByUserId(userId);
    }

    // 웹사이트 저장
    @PostMapping("/save")
    public Website saveWebsite(@RequestBody Website website) {
        // 내비게이션 링크의 website 필드를 설정
        if (website.getNavLinks() != null) {
            for (NavLink navLink : website.getNavLinks()) {
                navLink.setWebsite(website); // 각 navLink의 website 설정
            }
        }
        return websiteRepository.save(website);
    }
}
