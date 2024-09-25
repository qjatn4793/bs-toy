import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchDockerServiceUrl = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/create-docker-service`); // API 엔드포인트
    return response.data; // 데이터 반환
  } catch (error) {
    console.error('Error fetching service URL:', error);
    throw error; // 오류 발생 시 다시 던짐
  }
};