import axios from 'axios';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.js 초기화
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StockPricePredictor = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [ticker, setTicker] = useState('005930.KS'); // 기본 주식 심볼 (삼성전자)
    const [startDate, setStartDate] = useState('2001-11-10'); // 기본 시작 날짜
    const [endDate, setEndDate] = useState('2024-10-10'); // 기본 종료 날짜
    const [futureSteps, setFutureSteps] = useState(30); // 기본 예측 날짜 수
    const API_URL = 'http://localhost:5100'; // Flask API URL

    const stockOptions = [
        "005930.KS", // 삼성전자
        "AAPL",      // 애플
        "NFLX",      // 넷플릭스
        "QQQ",       // QQQ
        "SPY",       // S&P 500 ETF
        "TSLA",      // 테슬라
        // 여기에서 다른 주식 심볼 추가 가능
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/predict`, {
                params: {
                    ticker,
                    start: startDate,
                    end: endDate,
                    future_steps: futureSteps,
                },
            });
            setData(response.data); // JSON 데이터로 상태 업데이트
            console.log('Fetched data:', response.data); // 디버그 로그
        } catch (error) {
            console.error('Error fetching stock price data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 차트 데이터 준비
    const chartData = {
        labels: data?.dates.concat(data?.future_dates), // 과거 및 미래 날짜를 레이블로 사용
        datasets: [
            {
                label: '예측 가격',
                data: data ? data.predicted.concat(data.future_predictions) : [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: '실제 가격',
                data: data?.actual,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <div>
            <h1>주식 가격 예측</h1>
            <div>
                <label htmlFor="ticker">주식 선택:</label>
                <select id="ticker" value={ticker} onChange={(e) => setTicker(e.target.value)}>
                    {stockOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="startDate">시작 날짜:</label>
                <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
                <label htmlFor="endDate">종료 날짜:</label>
                <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div>
                <label htmlFor="futureSteps">예측할 미래 날짜 수:</label>
                <input type="number" id="futureSteps" value={futureSteps} onChange={(e) => setFutureSteps(Number(e.target.value))} />
            </div>
            <button onClick={fetchData} disabled={isLoading}>
                {isLoading ? '분석 중...' : '분석 시작'}
            </button>
            {data ? (
                <div>
                    <p>훈련 RMSE: {data.train_rmse}</p>
                    <p>테스트 RMSE: {data.test_rmse}</p>
                    <h2>가격 비교 그래프</h2>
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <Bar data={chartData} />
                    </div>
                </div>
            ) : (
                <p>로딩 중...</p>
            )}
        </div>
    );
};

export default StockPricePredictor;
