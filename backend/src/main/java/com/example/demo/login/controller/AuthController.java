package com.example.demo.login.controller;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.login.config.JwtUtil;
import com.example.demo.login.entity.User;
import com.example.demo.login.service.CustomUserDetailsService;
import com.example.demo.login.service.UserService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        log.info("Attempting to register user: {}", user.getUsername());
        try {
            user.setPassword(user.getPassword());
            User registeredUser = userService.registerUser(user.getUsername(), user.getPassword()); // 사용자 등록
            log.info("User registered successfully: {}", user.getUsername());
            return ResponseEntity.ok(registeredUser); // 성공 응답
        } catch (Exception e) {
            log.error("Error registering user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User registration failed"); // 실패 응답
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        log.info("사용자 로그인 시도: {}", user.getUsername());
        
        try {
            // 사용자 정보를 DB에서 가져옵니다.
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getUsername());

            // 입력된 비밀번호와 DB의 해시된 비밀번호 비교
            boolean passwordMatch = passwordEncoder.matches(user.getPassword(), userDetails.getPassword());
            log.info("비밀번호 일치 여부: {}", passwordMatch);
            
            if (!passwordMatch) {
                throw new BadCredentialsException("자격 증명이 올바르지 않습니다.");
            }

            // 비밀번호가 일치하면 인증
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );

            String token = jwtUtil.generateToken(authentication.getName());
            log.info("사용자가 성공적으로 로그인했습니다: {}", user.getUsername());
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } catch (BadCredentialsException e) {
            log.error("사용자 {}의 로그인 실패: {}", user.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: 잘못된 자격 증명입니다.");
        } catch (Exception e) {
            log.error("사용자 {}의 로그인 실패: {}", user.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }
}