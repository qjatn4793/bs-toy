import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RoomDetail = () => {
  const { roomId } = useParams(); // URL에서 roomId 추출
  const [room, setRoom] = useState(null); // 선택된 숙소 상태
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // 숙소 상세 정보 가져오기
    const fetchRoomDetail = async () => {
      const response = await fetch(`${API_URL}/api/rooms/${roomId}`);
      const data = await response.json();
      setRoom(data);
    };
    fetchRoomDetail();
  }, [roomId]);

  const handleReservationClick = () => {
    navigate(`/rooms/${roomId}/reserve`); // 예약 페이지로 이동
  };

  if (!room) return <div>Loading...</div>;

  const handleHomeAccess = () => {
    navigate('/home'); // 홈 페이지로 이동
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{room.name}</h1>
      <p>{room.description}</p>
      <p>Price: {room.price} per night</p>
      <button onClick={handleReservationClick}>Reserve Now</button>
      <button onClick={handleHomeAccess}>메인으로</button>
    </div>
  );
};

export default RoomDetail;
