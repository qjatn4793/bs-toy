import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

const Home = () => {
  const [rooms, setRooms] = useState([]); // 숙소 목록 상태
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // API 호출하여 숙소 목록 가져오기
    const fetchRooms = async () => {
      if (!user) {
        return; // 유저가 없으면 함수 종료
      }

      try {
        const response = await axiosInstance.get(`/api/rooms`); // 서버에서 숙소 정보 가져옴
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, [user]);

  const handleRoomClick = (roomId) => {
    navigate(`/rooms/${roomId}`); // 개별 숙소 상세 페이지로 이동
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Available Rooms</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.id} onClick={() => handleRoomClick(room.id)}>
            {room.name} - {room.price} per night
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
