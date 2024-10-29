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
    </div>
  );
};

export default DockerService;
