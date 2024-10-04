package com.example.demo.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.login.entity.User;
import com.example.demo.login.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;

@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    	
    	log.info("username : {}", username);
    	
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("찾을 수 없는 이름 : " + username));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new ArrayList<>());
    }
}
