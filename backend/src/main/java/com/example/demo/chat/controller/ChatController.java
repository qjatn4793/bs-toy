package com.example.demo.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.demo.chat.service.ChatService;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/chatbot")
public class ChatController {
	
	private RestTemplate restTemplate = new RestTemplate();
	
	@Autowired
	ChatService chatService;

    @PostMapping("/send-message")
    public String sendMessage(@RequestBody Map<String, String> requestBody) {
        String message = requestBody.get("message");

        // 요청 시간 기록
        LocalDateTime requestTime = LocalDateTime.now();
        log.info("Request Time: {}, Message: {}", requestTime, message);

        // Flask 서버의 엔드포인트 URL
        String url = "http://localhost:5000/chat";  // Flask 서버의 URL

        // Flask 서버로 보낼 요청 데이터
        Map<String, String> request = new HashMap<>();
        request.put("message", message);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);

        // Flask 서버로 POST 요청 보내기
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        // 응답 시간 기록
        LocalDateTime responseTime = LocalDateTime.now();
        log.info("Response Time: {}, Response: {}", responseTime, response.getBody());

        // 영어 응답을 한국어로 번역
        //String translatedResponse = chatService.translation(response.getBody());
        //log.info("번역 내용 : {}" , translatedResponse);

        return response.getBody();
    }
}