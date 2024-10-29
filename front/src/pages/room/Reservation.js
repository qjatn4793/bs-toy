import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // import CSS
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

const Reservation = () => {
  const { roomId } = useParams(); // 선택된 숙소 ID
  const [startDate, setStartDate] = useState(null); // 예약 시작 날짜
  const [endDate, setEndDate] = useState(null); // 예약 종료 날짜
  const [availableDates, setAvailableDates] = useState([]); // 예약 가능한 날짜 목록
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!user) {
        return; // 유저가 없으면 함수 종료
      }

      try {
        const response = await axiosInstance.get(`/api/rooms/${roomId}/available-dates`);
        if (response.ok) {
          const data = await response.json();
          setAvailableDates(data); // 서버에서 받은 예약 가능한 날짜 목록 설정
        } else {
          console.error('Failed to fetch available dates.');
        }
      } catch (error) {
        console.error('Error fetching available dates:', error);
      }
    };

    fetchAvailableDates(); // 컴포넌트가 마운트될 때 예약 가능한 날짜를 가져옵니다.
  }, [roomId]);

  const handleReservationSubmit = async (event) => {
    event.preventDefault();

    // 확인을 위한 로그
    console.log('Original Start Date:', startDate);
    console.log('Original End Date:', endDate);

    // 수동으로 날짜 포맷팅 (YYYY-MM-DD)
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    // 확인을 위한 로그
    console.log('Formatted Start Date:', formattedStartDate);
    console.log('Formatted End Date:', formattedEndDate);

    try {
        // 예약 요청 보내기
        const response = await axiosInstance.post(`/api/rooms/${roomId}/reserve`, 
            JSON.stringify({ startDate: formattedStartDate, endDate: formattedEndDate }),
            { headers: { 'Content-Type': 'application/json' } } // 헤더를 설정하여 JSON 포맷을 명시
        );

        // 성공 메시지 처리
        alert(response.data || 'Reservation successful!'); // response.data에 message가 있을 경우 사용
        navigate('/rooms'); // 메인 페이지로 이동
    } catch (error) {
        // 오류 처리
        console.error('Error during reservation:', error);
        const errorMessage = error.response ? error.response.data.message : 'An error occurred';
        alert(errorMessage); // 오류 메시지 알림
    }
  };


  // 특정 날짜가 예약 가능한지 확인하는 헬퍼 함수
  const isDateAvailable = (date) => {
    return availableDates.some((availableDate) => {
      const available = new Date(availableDate);
      return (
        date.getFullYear() === available.getFullYear() &&
        date.getMonth() === available.getMonth() &&
        date.getDate() === available.getDate()
      );
    });
  };

  const handleRoomsAccess = () => {
    navigate('/rooms'); // 홈 페이지로 이동
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Reserve Room</h1>
      <form onSubmit={handleReservationSubmit}>
        <div>
          <label>Start Date: </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            // filterDate={isDateAvailable} // 필터링된 날짜만 선택 가능
            dateFormat="yyyy/MM/dd"
            placeholderText="Select a start date"
            required
          />
        </div>
        <div>
          <label>End Date: </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            // filterDate={isDateAvailable} // 필터링된 날짜만 선택 가능
            dateFormat="yyyy/MM/dd"
            placeholderText="Select an end date"
            required
          />
        </div>
        <button type="submit">Confirm Reservation</button>
      </form>
      <button onClick={handleRoomsAccess}>메인으로</button>
    </div>
  );
};

export default Reservation;
