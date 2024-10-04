import React, { useState } from 'react';
import { fetchDockerServiceUrl } from './apis/Api';
import { useAuth } from '../../context/AuthContext'; // AuthContext import
import { useNavigate } from 'react-router-dom'; // useNavigate import

const DockerService = () => {
  const [url, setUrl] = useState('');
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { logout } = useAuth(); // AuthContext의 logout 함수 가져오기
  const navigate = useNavigate(); // useNavigate 훅 가져오기

  const handleFetchServiceUrl = async () => {
    setLoading(true);
    try {
      const result = await fetchDockerServiceUrl();
      setUrl(result.containerUrl);
      setLogs(result.message || '');
    } catch (error) {
      console.error('Error fetching service URL:', error);
      setLogs('Error occurred while creating the service');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // JWT 토큰 삭제
    logout(); // AuthContext에서 로그아웃 상태 변경
    navigate('/login'); // 로그인 페이지로 리다이렉트
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>My Docker Service App</h1>
      <button onClick={handleFetchServiceUrl} disabled={loading}>
        {loading ? 'Creating...' : 'Create Docker Service'}
      </button>
      {loading && <div>Loading...</div>}
      {url && (
        <div>
          <h2>Service URL:</h2>
          <p>{url}</p>
        </div>
      )}
      {logs && (
        <div>
          <h2>Logs:</h2>
          <pre>{logs}</pre>
        </div>
      )}
      {/* 로그아웃 버튼 추가 */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DockerService;
