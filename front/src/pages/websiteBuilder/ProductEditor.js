import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import './Editor.css';

const Editor = () => {
    const [header, setHeader] = useState('');
    const [mainContent, setMainContent] = useState('');
    const [footer, setFooter] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [navLinks, setNavLinks] = useState([]); // 내비게이션 링크 상태
    const [navLinkName, setNavLinkName] = useState(''); // 새 링크 이름
    const [navLinkUrl, setNavLinkUrl] = useState(''); // 새 링크 URL
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleAddNavLink = () => {
        if (navLinkName && navLinkUrl) {
            setNavLinks([...navLinks, { name: navLinkName, url: navLinkUrl }]);
            setNavLinkName(''); // 입력 초기화
            setNavLinkUrl(''); // 입력 초기화
        } else {
            alert('링크 이름과 URL을 입력해주세요.');
        }
    };

    const handleSave = async () => {
        if (!user) {
            alert('로그인 후 웹사이트를 저장할 수 있습니다.');
            return;
        }

        // 유효성 검사
        if (!header || !mainContent || !footer || !imageUrl) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        const websiteData = {
            userId: user.id,
            headerContent: header,
            mainContent: mainContent,
            footerContent: footer,
            imageUrl: imageUrl,
            navLinks: navLinks, // 내비게이션 링크 추가
        };

        try {
            setLoading(true); // 로딩 상태 설정
            const response = await axiosInstance.post(`/api/websites/save`, websiteData);

            if (response.status === 200 || response.status === 201) {
                alert('Website saved successfully');
                // 입력 초기화
                setHeader('');
                setMainContent('');
                setFooter('');
                setImageUrl('');
                setNavLinks([]); // 내비게이션 링크 초기화
            } else {
                alert('Failed to save website');
            }
        } catch (error) {
            console.error('Error saving website:', error);
            alert('Error saving website');
        } finally {
            setLoading(false); // 로딩 상태 해제
        }
    };

    return (
        <div className="editor-container">
            <h1>숙소 소개 사이트 빌더</h1>
            {user ? (
                <div className="user-info">
                    <p>Logged in as: {user.username}</p>
                    <p>User ID: {user.id}</p>
                </div>
            ) : (
                <p>Please log in to save your website.</p>
            )}
            <div className="input-group">
                <label>헤더: </label>
                <input
                    type="text"
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                    placeholder="숙소 이름"
                />
            </div>
            <div className="input-group">
                <label>메인 콘텐츠: </label>
                <textarea
                    value={mainContent}
                    onChange={(e) => setMainContent(e.target.value)}
                    placeholder="숙소 설명 및 특징"
                />
            </div>
            <div className="input-group">
                <label>푸터: </label>
                <input
                    type="text"
                    value={footer}
                    onChange={(e) => setFooter(e.target.value)}
                    placeholder="연락처 정보"
                />
            </div>
            <div className="input-group">
                <label>이미지 URL: </label>
                <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="숙소 이미지 URL"
                />
            </div>

            {/* 내비게이션 링크 추가 섹션 */}
            <div className="input-group">
                <label>내비게이션 링크 이름: </label>
                <input
                    type="text"
                    value={navLinkName}
                    onChange={(e) => setNavLinkName(e.target.value)}
                    placeholder="링크 이름"
                />
            </div>
            <div className="input-group">
                <label>내비게이션 링크 URL: </label>
                <input
                    type="text"
                    value={navLinkUrl}
                    onChange={(e) => setNavLinkUrl(e.target.value)}
                    placeholder="링크 URL"
                />
            </div>
            <button onClick={handleAddNavLink}>Add Nav Link</button>

            {/* 추가된 내비게이션 링크 리스트 */}
            <div className="nav-links-list">
                <h3>내비게이션 링크:</h3>
                <ul>
                    {navLinks.map((link, index) => (
                        <li key={index}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Website'}
            </button>

            {/* 미리보기 섹션 */}
            <div className="preview-section">
                <h2>미리보기</h2>
                <div className="website-preview">
                    <header style={{ background: '#f5f5f5', padding: '20px', textAlign: 'center' }}>
                        <h1>{header}</h1>
                        <nav>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {navLinks.map((link, index) => (
                                    <li key={index} style={{ display: 'inline', margin: '0 10px' }}>
                                        <a href={link.url} style={{ textDecoration: 'none', color: '#007bff' }}>
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </header>
                    <main style={{ padding: '20px' }}>
                        <p>{mainContent}</p>
                        {imageUrl && <img src={imageUrl} alt="숙소" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />}
                    </main>
                    <footer style={{ background: '#f5f5f5', padding: '10px', textAlign: 'center' }}>
                        <p>{footer}</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Editor;
