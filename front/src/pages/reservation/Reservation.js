import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // import CSS

const Reservation = () => {
  const { roomId } = useParams(); // 선택된 숙소 ID
  const [startDate, setStartDate] = useState(null); // 예약 시작 날짜
  const [endDate, setEndDate] = useState(null); // 예약 종료 날짜
  const [availableDates, setAvailableDates] = useState([]); // 예약 가능한 날짜 목록
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await fetch(`${API_URL}/api/rooms/${roomId}/available-dates`);
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
  }, [API_URL, roomId]);

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

    // 예약 요청 보내기
    const response = await fetch(`${API_URL}/api/rooms/${roomId}/reserve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate: formattedStartDate, endDate: formattedEndDate }),
    });

    if (response.ok) {
        const successMessage = await response.text(); // 성공 메시지를 읽기
        alert(successMessage);
        navigate('/'); // 메인 페이지로 이동
    } else {
        const errorMessage = await response.text(); // 오류 메시지를 읽기
        alert(errorMessage);
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

  const handleHomeAccess = () => {
    navigate('/home'); // 홈 페이지로 이동
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
            filterDate={isDateAvailable} // 필터링된 날짜만 선택 가능
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
            filterDate={isDateAvailable} // 필터링된 날짜만 선택 가능
            dateFormat="yyyy/MM/dd"
            placeholderText="Select an end date"
            required
          />
        </div>
        <button type="submit">Confirm Reservation</button>
      </form>
      <button onClick={handleHomeAccess}>메인으로</button>
    </div>
  );
};

export default Reservation;
