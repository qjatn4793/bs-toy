import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Nav.css';

function Nav() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav>
      <ul>
        <li><button onClick={() => handleNavigation("/")}>Home</button></li>
        <li><button onClick={() => handleNavigation("/guest-service")}>Guest Service</button></li>
        <li><button onClick={() => handleNavigation("/chatbot")}>Chatbot</button></li>
        <li><button onClick={() => handleNavigation("/stock")}>Stock Predictor</button></li>
        <li><button onClick={() => handleNavigation("/rooms")}>Rooms</button></li>
        <li><button onClick={() => handleNavigation("/snake-game")}>Snake Game</button></li>
        <li><button onClick={() => handleNavigation("/mario-game")}>Mario Game</button></li>
        <li><button onClick={() => handleNavigation("/turn-game")}>Trun Game</button></li>
        
        {isAuthenticated ? (
          <>
            <li><button onClick={() => handleNavigation("/docker-service")}>Docker Service</button></li>
            <li><button onClick={() => handleNavigation("/website-builder")}>Website Builder</button></li>
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><button onClick={() => handleNavigation("/login")}>Login</button></li>
            <li><button onClick={() => handleNavigation("/register")}>Register</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
