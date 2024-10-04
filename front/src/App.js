import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import DockerService from './pages/docker/DockerService';
import ProtectedRoute from './components/ProtectedRoute'; // ProtectedRoute 컴포넌트 임포트

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/docker-service" element={<ProtectedRoute component={DockerService} />} />
          <Route path="*" element={<ProtectedRoute component={null} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;