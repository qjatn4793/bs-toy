import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const messagesEndRef = useRef(null); // 메시지 끝을 가리키는 ref

    const sendMessage = async (e) => {
        e.preventDefault();

        // 스프링부트 API 호출
        try {
            const response = await axios.post(`${API_URL}/api/chatbot/send-message`, { message });
            const botResponse = response.data; // 서버에서 반환된 데이터
            setResponses([...responses, { user: message, bot: botResponse.response }]);
            setMessage('');
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };

    // useEffect를 사용하여 responses가 업데이트될 때마다 스크롤을 아래로 이동
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [responses]); // responses가 변경될 때마다 실행

    return (
        <div>
            <h1>Chatbot</h1>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc' }}>
                {responses.map((res, index) => (
                    <div key={index}>
                        <strong>You:</strong> {res.user}
                        <br />
                        <strong>Bot:</strong> {res.bot}
                        <hr />
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* 스크롤을 이동할 요소 */}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;