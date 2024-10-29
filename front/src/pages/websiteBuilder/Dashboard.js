import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [websites, setWebsites] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWebsites = async () => {
            if (!user) {
                return; // 유저가 없으면 함수 종료
            }

            try {
                const response = await axiosInstance.get(`/api/websites/${user.id}`);
                setWebsites(response.data);
            } catch (error) {
                console.error('Error fetching websites:', error);
            }
        };

        fetchWebsites();
    }, [user]);

    // 웹사이트 추가 핸들러
    const handleAddWebsite = () => {
        navigate('/website-builder/create'); // 웹사이트 추가 페이지로 이동
    };

    // 웹사이트 제목 클릭 핸들러
    const handleWebsiteClick = (websiteId) => {
        navigate(`/website-builder/website/${websiteId}`); // 해당 웹사이트의 페이지로 이동
    };

    // 웹사이트 삭제 핸들러
    const handleDeleteWebsite = async (websiteId) => {
        if (window.confirm("Are you sure you want to delete this website?")) {
            try {
                await axiosInstance.delete(`/api/websites/${websiteId}`);
                setWebsites(websites.filter(website => website.id !== websiteId)); // 삭제 후 상태 업데이트
            } catch (error) {
                console.error('Error deleting website:', error);
            }
        }
    };

    return (
        <div>
            <h1>My Websites</h1>
            <button onClick={handleAddWebsite}>Add Website</button> {/* 웹사이트 추가 버튼 */}
            <ul>
                {websites.map((website) => (
                    <li key={website.id} onClick={() => handleWebsiteClick(website.id)} style={{ cursor: 'pointer', width: '300px', backgroundColor: 'green' }}>
                        <h3>{website.websiteName}</h3>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteWebsite(website.id); }}>Delete</button> {/* 삭제 버튼 */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
