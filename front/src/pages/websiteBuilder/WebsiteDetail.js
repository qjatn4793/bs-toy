import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link를 추가
import axiosInstance from '../../utils/axiosInstance';

const WebsiteDetail = () => {
    const { websiteId } = useParams(); // URL에서 websiteId 추출
    const [website, setWebsite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // 에러 상태 추가

    useEffect(() => {
        const fetchWebsite = async () => {
            try {
                const response = await axiosInstance.get(`/api/websites/detail/${websiteId}`);
                setWebsite(response.data);
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

    if (!website) {
        return <div>Website not found.</div>; // 웹사이트가 없을 때
    }

    return (
        <div>
            <h1>{website.headerContent}</h1>
            <nav>
                <ul>
                    {website.navLinks.map((link) => (
                        <li key={link.id}>
                            <Link to={link.path}>{link.name}</Link> {/* Link 컴포넌트로 변경 */}
                        </li>
                    ))}
                </ul>
            </nav>
            <main>
                <p>{website.mainContent}</p>
            </main>
            <footer>{website.footerContent}</footer>
        </div>
    );
};

export default WebsiteDetail;
