import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import axiosInstance from '../../utils/axiosInstance';

const WebsiteDetail = () => {
    const { websiteId } = useParams(); // URL에서 websiteId 추출
    const [navLinks, setNavLinks] = useState([]);
    const [activeTab, setActiveTab] = useState(0); // 선택된 탭 상태 추가
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

    // HTML 파일로 다운로드하는 함수
    const handleDownload = () => {
        const currentPage = navLinks[activeTab];

        // HTML 내용 생성
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${currentPage.name}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                header { background-color: #f5f5f5; padding: 20px; text-align: center; }
                main { padding: 20px; }
                footer { background-color: #f5f5f5; padding: 10px; text-align: center; }
                nav ul { list-style-type: none; padding: 0; }
                nav ul li { display: inline; margin: 0 10px; }
                a { text-decoration: none; color: #007bff; }
            </style>
        </head>
        <body>
            <header>
                <h1>${currentPage.header}</h1>
                <nav>
                    <ul>
                        ${navLinks
                            .map(link => `<li><a href="${link.path}">${link.name}</a></li>`)
                            .join('')}
                    </ul>
                </nav>
            </header>
            <main>
                <p>${currentPage.content}</p>
            </main>
            <footer>
                <p>${currentPage.footer}</p>
            </footer>
        </body>
        </html>
        `;

        // Blob 생성 및 다운로드
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${currentPage.name}.html`; // 파일명 설정
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 대시보드로 이동하는 핸들러
    const handleDashboardClick = () => {
        navigate('/website-builder'); // 대시보드 페이지로 이동
    };

    return (
        <div>
            <h1>Navigation Links</h1>
            <button onClick={handleDashboardClick}>Go to Dashboard</button> {/* 대시보드 버튼 */}

            {/* 내비게이션 탭 */}
            <nav>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {navLinks.map((link, index) => (
                        <li 
                            key={link.id} 
                            style={{ display: 'inline', margin: '0 10px' }}
                            onClick={() => setActiveTab(index)}
                            className={activeTab === index ? 'active' : ''}
                        >
                            <button style={{ textDecoration: 'none', color: activeTab === index ? '#007bff' : '#000' }}>
                                {link.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* 선택된 내비게이션 링크 미리보기 */}
            {navLinks.length > 0 && (
                <div className="preview-section">
                    <h2>미리보기: {navLinks[activeTab].name}</h2>
                    <header style={{ backgroundColor: '#f5f5f5', padding: '20px', textAlign: 'center' }}>
                        <h1>{navLinks[activeTab].header}</h1>
                        <nav>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {navLinks.map((link, index) => (
                                    <li key={index} style={{ display: 'inline', margin: '0 10px' }}>
                                        <Link to={link.path} style={{ textDecoration: 'none', color: '#007bff' }}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </header>
                    <main style={{ padding: '20px' }}>
                        <p>{navLinks[activeTab].content}</p>
                    </main>
                    <footer style={{ backgroundColor: '#f5f5f5', padding: '10px', textAlign: 'center' }}>
                        <p>{navLinks[activeTab].footer}</p>
                    </footer>
                </div>
            )}

            {/* 다운로드 버튼 */}
            <button onClick={handleDownload} style={{ marginTop: '20px' }}>
                현재 페이지 다운로드
            </button>
        </div>
    );
};

export default WebsiteDetail;
