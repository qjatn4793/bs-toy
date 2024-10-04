import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    // 인증되지 않은 경우, 토큰을 삭제하고 경고 메시지를 표시
    localStorage.removeItem('token'); // 토큰 삭제
    alert('잘못된 경로이거나 인증되지 않아 로그인 페이지로 리다이렉트되었습니다.');
    logout(); // 로그아웃 처리
    return <Navigate to="/login" />; // 로그인 페이지로 리다이렉트
  }

  return <Component />;
};

export default ProtectedRoute;