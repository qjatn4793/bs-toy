package com.example.demo.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.login.entity.User;
import com.example.demo.login.entity.UserPrincipal;
import com.example.demo.login.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

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

	    // 권한 설정 (여기서는 ROLE_USER로 설정하지만, 실제 권한 정보를 데이터베이스에서 가져오는 것도 가능합니다)
	    List<GrantedAuthority> authorities = new ArrayList<>();
	    authorities.add(new SimpleGrantedAuthority("ROLE_USER")); // 사용자의 권한을 추가

	    return new UserPrincipal(user.getId(), user.getUsername(), user.getPassword(), authorities); // UserPrincipal 반환
	}
}
