import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

const RoomDetail = () => {
  const { roomId } = useParams(); // URL에서 roomId 추출
  const [room, setRoom] = useState(null); // 선택된 숙소 상태
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 숙소 상세 정보 가져오기
    const fetchRoomDetail = async () => {
      if (!user) {
        return; // 유저가 없으면 함수 종료
      }

      try {
        const response = await axiosInstance.get(`/api/rooms/${roomId}`);

        console.log(response);

        setRoom(response.data);
      } catch (error) {
        console.error('Error fetching room:', error);
      }
    };
    fetchRoomDetail();
  }, [roomId]);

  const handleReservationClick = () => {
    navigate(`/rooms/${roomId}/reserve`); // 예약 페이지로 이동
  };

  if (!room) return <div>Loading...</div>;

  const handleRoomAccess = () => {
    navigate('/rooms'); // 홈 페이지로 이동
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{room.name}</h1>
      <p>{room.description}</p>
      <p>가격: {room.price} per night</p>
      <p>남은 방: {room.quantity}</p>
      <button onClick={handleReservationClick}>Reserve Now</button>
      <button onClick={handleRoomAccess}>메인으로</button>
    </div>
  );
};

export default RoomDetail;
