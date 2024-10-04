import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.'); // Passwords do not match
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert('회원가입이 성공적으로 완료되었습니다! 이제 로그인할 수 있습니다.'); // Registration successful
        navigate('/login'); // 회원가입 후 로그인 페이지로 리다이렉트
      } else {
        const errorData = await response.json();
        // 서버에서 제공하는 에러 메시지가 있는 경우 사용
        alert(`회원가입 실패: ${errorData.message || '다시 시도해 주세요.'}`); // Registration failed
      }
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error); // Error during registration
      alert('회원가입 실패. 나중에 다시 시도해 주세요.'); // Registration failed
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>회원가입</h1> {/* Register */}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="사용자 이름" // Username
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호" // Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호 확인" // Confirm Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">회원가입</button> {/* Register */}
      </form>
    </div>
  );
};

export default Register;
