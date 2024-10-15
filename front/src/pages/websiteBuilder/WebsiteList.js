import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const WebsiteList = () => {
    const [websites, setWebsites] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate(); // navigate 훅을 추가

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

    // 웹사이트 제목 클릭 핸들러
    const handleWebsiteClick = (websiteId) => {
        navigate(`/website-builder/website/${websiteId}`); // 해당 웹사이트의 페이지로 이동
    };

    return (
        <div>
            <h1>My Websites</h1>
            <ul>
                {websites.map((website) => (
                    <li key={website.id} onClick={() => handleWebsiteClick(website.id)} style={{ cursor: 'pointer' }}>
                        <h3>{website.websiteName}</h3> {/* 웹사이트 이름으로 변경 */}
                        <footer>{website.footerContent}</footer>
                        {website.imageUrl && (
                            <img src={website.imageUrl} alt="Website" style={{ width: '100px', height: '100px' }} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WebsiteList;
