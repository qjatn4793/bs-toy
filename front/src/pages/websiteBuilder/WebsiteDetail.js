import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import axiosInstance from '../../utils/axiosInstance';

const WebsiteDetail = () => {
    const { websiteId } = useParams(); // URL에서 websiteId 추출
    const [navLinks, setNavLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // 에러 상태 추가
    const navigate = useNavigate(); // navigate 훅 추가

    useEffect(() => {
        const fetchWebsite = async () => {
            try {
                const response = await axiosInstance.get(`/api/websites/detail/${websiteId}`);
                setNavLinks(response.data.navLinks); // navLinks 데이터 설정
            } catch (error) {
                console.error('Error fetching website details:', error);
                setError('Failed to load website details. Please try again later.'); // 에러 메시지 설정
            } finally {
                setLoading(false);
            }
        };

        fetchWebsite();
    }, [websiteId]);

    if (loading) {
        return <div>Loading...</div>; // 로딩 상태
    }

    if (error) {
        return <div>{error}</div>; // 에러 상태
    }

    if (!navLinks || navLinks.length === 0) {
        return <div>No navigation links found.</div>; // 내비게이션 링크가 없을 때
    }

    // 대시보드로 이동하는 핸들러
    const handleDashboardClick = () => {
        navigate('/website-builder'); // 대시보드 페이지로 이동
    };

    return (
        <div>
            <h1>Navigation Links</h1>
            <button onClick={handleDashboardClick}>Go to Dashboard</button> {/* 대시보드 버튼 */}
            <nav>
                <ul>
                    {navLinks.map((link) => (
                        <li key={link.id}>
                            <h3>{link.name}</h3>
                            <p>{link.content}</p> {/* 링크 내용 표시 */}
                            <footer>{link.footer}</footer>
                            <Link to={link.path}>Go to {link.name}</Link> {/* 링크로 이동 */}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default WebsiteDetail;
