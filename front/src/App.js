import React, { useState } from 'react';
import { fetchDockerServiceUrl } from './api';

function App() {
  const [url, setUrl] = useState('');
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handleFetchServiceUrl = async () => {
    setLoading(true); // 로딩 시작
    try {
      const result = await fetchDockerServiceUrl(); // API 호출
      setUrl(result.containerUrl); // URL 설정
      setLogs(result.message || ''); // 로그 설정
    } catch (error) {
      console.error('Error fetching service URL:', error);
      setLogs('Error occurred while creating the service'); // 오류 발생 시 로그 설정
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>My Docker Service App</h1>
      <button onClick={handleFetchServiceUrl} disabled={loading}>
        {loading ? 'Creating...' : 'Create Docker Service'}
      </button>
      {loading && <div>Loading...</div>} {/* 로딩 표시 */}
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
}

export default App;
