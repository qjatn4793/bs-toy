package com.example.demo.docker.controller;

import com.example.demo.docker.dto.DockerDto;
import com.example.demo.docker.service.DockerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DockerController {

	private final DockerService testService;
	
	@GetMapping("/test")
    public String test() {
        return "test 입니다.";
    }

	@GetMapping("/create-docker-service")
    public ResponseEntity<Map<String, String>> deployProject() {
        log.info("도커 서비스를 생성하는 요청을 받았습니다.");
        Map<String, String> response = new HashMap<>();

        // 리액트 앱 빌드
        if (!testService.buildReactApp()) {
            log.error("리액트 앱 빌드에 실패했습니다.");
            response.put("error", "리액트 앱 빌드 실패");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        // 백엔드 프로젝트 빌드
        if (!testService.buildProjectWithGradle()) {
            log.error("백엔드 프로젝트 빌드에 실패했습니다.");
            response.put("error", "백엔드 프로젝트 빌드 실패");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        // Nginx 설정 파일 생성
        testService.createNginxConfig();

        // 도커파일 생성
        testService.createDockerfile();

        // 도커 컨테이너 실행
        DockerDto testDto  = testService.startDockerContainer();
        if (testDto != null) {
            // 랜덤 포트 생성 및 URL 생성
            String containerUrl = testService.getContainerUrl(testDto.getPort());
            log.info("도커 서비스가 성공적으로 생성되었습니다. URL: {}", containerUrl);
            response.put("message", "도커 서비스가 성공적으로 생성되었습니다.");
            response.put("containerUrl", containerUrl);
            return ResponseEntity.ok(response);
        }

        log.error("도커 서비스 생성에 실패했습니다.");
        response.put("error", "도커 서비스 생성 실패");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}