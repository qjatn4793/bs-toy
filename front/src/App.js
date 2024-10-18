import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import Dashboard from './pages/websiteBuilder/Dashboard'; // 웹사이트 대시보드 페이지 추가
import WebsiteEditor from './pages/websiteBuilder/WebsiteEditor'; // 웹사이트 에디터 페이지 추가
import WebsiteDetail from './pages/websiteBuilder/WebsiteDetail'; // 웹사이트 상세보기 페이지 추가

const AuthCheck = () => {
  const { isAuthenticated, isLoading } = useAuth(); // 인증 상태 및 로딩 상태 가져오기

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때 보여줄 UI
  }

  return isAuthenticated ? <Navigate replace to="/docker-service" /> : <Navigate replace to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 기본 경로로 비로그인 서비스 페이지로 리다이렉트 */}
          <Route path="/" element={<AuthCheck />} />
          
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

          {/* 웹사이트 빌더 대시보드 및 관련 경로 추가 */}
          <Route path="/website-builder" element={<ProtectedRoute component={Dashboard} />} /> {/* 대시보드 */}
          <Route path="/website-builder/create" element={<ProtectedRoute component={WebsiteEditor} />} /> {/* 웹사이트 생성 페이지 */}
          <Route path="/website-builder/website/:websiteId" element={<ProtectedRoute component={WebsiteDetail} />} /> {/* 웹사이트 상세보기 */}

          {/* 404 Not Found 처리 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
