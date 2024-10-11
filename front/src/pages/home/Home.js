import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [rooms, setRooms] = useState([]); // 숙소 목록 상태
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // API 호출하여 숙소 목록 가져오기
    const fetchRooms = async () => {
      const response = await fetch(`${API_URL}/api/rooms`); // 서버에서 숙소 정보 가져옴
      const data = await response.json();
      setRooms(data);
    };
    fetchRooms();
  }, []);

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
