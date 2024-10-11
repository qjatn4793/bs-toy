import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // 인증되지 않은 경우, 토큰을 삭제하고 경고 메시지를 표시
    alert('로그인 후 이용해 주세요.');
    logout(); // 로그아웃 처리
    return <Navigate to="/login" />; // 로그인 페이지로 리다이렉트
  }

  return <Component />;
};

export default ProtectedRoute;