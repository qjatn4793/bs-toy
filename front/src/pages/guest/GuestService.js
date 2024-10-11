import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuestService = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <button onClick={handleLoginClick} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Go to Login
      </button>  
      <h1>Welcome, Guest!</h1>
      <p>You are accessing this page without logging in.</p>
    </div>
  );
};

export default GuestService;
