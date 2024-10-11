package com.example.demo.stock.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/stock")
public class StockController {
	
	private final RestTemplate restTemplate = new RestTemplate();

	@GetMapping("/predict")
    public String predictStockPrice() {
        String pythonApiUrl = "http://localhost:5100/api/predict"; // Python API URL
        log.info("Sending request to Python API at: {}", pythonApiUrl); // 로그 출력
        
        String response;
        try {
            response = restTemplate.getForObject(pythonApiUrl, String.class); // Python API 호출
            log.info("Received response from Python API"); // 응답 수신 로그
        } catch (Exception e) {
            log.error("Error occurred while calling Python API: {}", e.getMessage()); // 오류 로그
            return "Error occurred while calling Python API"; // 오류 메시지 반환
        }
        
        log.debug("Response from Python API: {}", response); // 응답 내용 로그 (디버그 레벨)
        return response; // 응답 반환
    }
}