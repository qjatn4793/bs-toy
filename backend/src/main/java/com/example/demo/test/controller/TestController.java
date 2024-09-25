package com.example.demo.test.controller;

import com.example.demo.test.service.TestService;
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
public class TestController {

	private final TestService testService;
	
	@GetMapping("/test")
    public String test() {
        return "test 입니다.";
    }

	@GetMapping("/create-docker-service")
	public ResponseEntity<Map<String, String>> createDockerService() {
	    log.info("도커 서비스를 생성하는 요청을 받았습니다.");
	    Map<String, String> response = new HashMap<>();

	    if (!testService.buildProjectWithGradle()) {
	        log.error("프로젝트 빌드에 실패했습니다.");
	        response.put("error", "Failed to build the project");
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	    }

	    testService.createDockerfile();
	    String containerId = testService.startDockerContainer();

	    if (containerId != null) {
	        String url = testService.getContainerUrl(containerId);
	        log.info("도커 서비스가 성공적으로 생성되었습니다. URL: {}", url);
	        response.put("message", url);
	        response.put("logs", "도커 서비스가 성공적으로 생성되었습니다."); // 실제 로그를 수집하여 넣어줄 수 있음
	        return ResponseEntity.ok(response);
	    }

	    log.error("도커 서비스 생성에 실패했습니다.");
	    response.put("error", "Failed to create Docker service");
	    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	}
}