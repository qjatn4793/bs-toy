import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import DockerService from './pages/docker/DockerService';
import GuestService from './pages/guest/GuestService';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/home/Home'; // 숙소 목록 페이지 추가
import RoomDetail from './pages/room/RoomDetail'; // 숙소 상세 페이지 추가
import Reservation from './pages/reservation/Reservation'; // 예약 페이지 추가
import Chatbot from './pages/chat/Chatbot'; // 챗봇 페이지 추가
import Stock from './pages/stock/StockPricePredictor'; // 주식 페이지 추가

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 기본 경로로 비로그인 서비스 페이지로 리다이렉트 */}
          <Route path="/" element={<Navigate replace to="/login" />} />
          
          {/* 비로그인 사용자를 위한 페이지 */}
          <Route path="/guest-service" element={<GuestService />} />

          {/* 챗봇 페이지 */}
          <Route path="/chatbot" element={<Chatbot />} />

          {/* 주식 예측 */}
          <Route path="/stock" element={<Stock />} />
          
          {/* 로그인 및 회원가입 페이지 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Docker 서비스 (로그인된 사용자만 접근 가능) */}
          <Route path="/docker-service" element={<ProtectedRoute component={DockerService} />} />
          
          {/* 숙소 목록 페이지 (로그인 여부와 상관없이 접근 가능) */}
          <Route path="/rooms" element={<Home />} />
          
          {/* 숙소 상세 페이지 (로그인 여부와 상관없이 접근 가능) */}
          <Route path="/rooms/:roomId" element={<RoomDetail />} />
          
          {/* 숙소 예약 페이지 (로그인된 사용자만 접근 가능) */}
          <Route path="/rooms/:roomId/reserve" element={<ProtectedRoute component={Reservation} />} />
          
          {/* 404 Not Found 처리 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;