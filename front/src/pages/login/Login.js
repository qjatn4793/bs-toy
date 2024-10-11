import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    // 서버 응답 확인
    const responseText = await response.text(); // JSON 대신 텍스트로 응답을 가져오기
    // console.log(responseText); // 응답 내용 로그
  
    // 응답이 정상적일 경우에만 JSON으로 파싱
    if (response.ok) {
      try {
        const data = JSON.parse(responseText); // 텍스트를 JSON으로 변환
        localStorage.setItem('token', data.token);
        login(); // 인증 상태 업데이트
        navigate('/docker-service');
      } catch (error) {
        console.error('JSON 파싱 실패:', error);
        alert('로그인 실패: 서버로부터 올바르지 않은 응답을 받았습니다.');
      }
    } else {
      alert('로그인 실패. 사용자명과 비밀번호를 확인해 주세요.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;