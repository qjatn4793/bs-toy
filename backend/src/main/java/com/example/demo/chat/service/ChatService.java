package com.example.demo.chat.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatService {
	
	public String translation(String responseChatbot) {
		
		// LibreTranslate의 엔드포인트 URL
        String url = "https://libretranslate.com/translate";

        // 번역 요청 데이터
        Map<String, String> request = new HashMap<>();
        request.put("q", responseChatbot);
        request.put("source", "en");
        request.put("target", "ko");
        request.put("format", "text");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);

        // 번역 요청 보내기
        ResponseEntity<Map> response = new RestTemplate().exchange(url, HttpMethod.POST, entity, Map.class);
        
        // 번역된 텍스트 반환
        return (String) response.getBody().get("translatedText");
	}
}
