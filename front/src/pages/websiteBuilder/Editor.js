import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // 사용자 인증 상태
import axiosInstance from '../../utils/axiosInstance'; // API 통신
import './Editor.css'; // 스타일 파일

const Editor = () => {
    const [navLinks, setNavLinks] = useState([]); // navLink 상태 관리
    const [newNavLink, setNewNavLink] = useState({ name: '', path: '', header: '', footer: '', content: '' }); // 새 링크
    const [activeTab, setActiveTab] = useState(0); // 현재 선택된 탭 (NavLink 수정용)
    const [loading, setLoading] = useState(false); // 로딩 상태
    const { user } = useAuth(); // 사용자 정보
    const [websiteName, setWebsiteName] = useState('');

    // 새로운 navLink 추가
    const handleAddNavLink = () => {
        if (newNavLink.name && newNavLink.path) {
            setNavLinks([...navLinks, newNavLink]); // 새로운 링크 추가
            setNewNavLink({ name: '', path: '', header: '', footer: '', content: '' }); // 입력 초기화
        } else {
            alert('링크 이름과 경로를 입력해주세요.');
        }
    };

    // navLink의 필드 변경
    const handleNavLinkChange = (index, key, value) => {
        const updatedLinks = [...navLinks];
        updatedLinks[index][key] = value;
        setNavLinks(updatedLinks);
    };

    // navLink 삭제
    const handleRemoveNavLink = (index) => {
        const updatedLinks = navLinks.filter((_, i) => i !== index);
        setNavLinks(updatedLinks);
        setActiveTab(0); // 첫 번째 탭으로 이동
    };

    // 저장 버튼 클릭 시 처리
    const handleSave = async () => {
        if (!user) {
            alert('로그인 후 저장할 수 있습니다.');
            return;
        }

        // 내비게이션 링크가 1개 이상인지 확인
        if (!websiteName || navLinks.length === 0) {
            alert('웹사이트 이름과 최소 하나의 내비게이션 링크를 추가해주세요.');
            return;
        }

        // 각 링크에 필요한 필드가 채워졌는지 확인
        for (const link of navLinks) {
            if (!link.name || !link.path || !link.header || !link.footer || !link.content) {
                alert('모든 내비게이션 링크의 필드를 채워주세요.');
                return;
            }
        }

        const websiteData = {
            userId: user.id,
            userName: user.username,
            websiteName, // 웹사이트 이름 추가
            navLinks, // NavLinks만 저장
        };

        try {
            setLoading(true);
            const response = await axiosInstance.post(`/api/websites/save`, websiteData);

            if (response.status === 200 || response.status === 201) {
                alert('Website saved successfully');
                setNavLinks([]); // 저장 후 입력 필드 초기화
            } else {
                alert('Failed to save website');
            }
        } catch (error) {
            console.error('Error saving website:', error);
            alert('Error saving website');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="editor-container">
            <h1>홈페이지 빌더</h1>
            {user ? (
                <div className="user-info">
                    <p>로그인 사용자: {user.username}</p>
                    <p>사용자 ID: {user.id}</p>
                </div>
            ) : (
                <p>로그인 후 저장할 수 있습니다.</p>
            )}

            {/* 홈페이지 이름 입력 섹션 */}
            <div className="input-group">
                <label>홈페이지 이름: </label>
                <input
                    type="text"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                    placeholder="홈페이지 이름"
                />
            </div>

            {/* 새로운 내비게이션 링크 추가 */}
            <div className="input-group">
                <label>내비게이션 링크 이름: </label>
                <input
                    type="text"
                    value={newNavLink.name}
                    onChange={(e) => setNewNavLink({ ...newNavLink, name: e.target.value })}
                    placeholder="링크 이름 입력"
                />
            </div>
            <div className="input-group">
                <label>내비게이션 링크 경로: </label>
                <input
                    type="text"
                    value={newNavLink.path}
                    onChange={(e) => setNewNavLink({ ...newNavLink, path: e.target.value })}
                    placeholder="링크 경로 입력"
                />
            </div>
            <button onClick={handleAddNavLink}>내비게이션 링크 추가</button>

            {/* 추가된 내비게이션 링크 리스트 */}
            {navLinks.length > 0 && (
                <div className="nav-links-list">
                    <h3>내비게이션 링크</h3>
                    <ul>
                        {navLinks.map((link, index) => (
                            <li key={index} className={activeTab === index ? 'active' : ''}>
                                <div onClick={() => setActiveTab(index)}>
                                    {link.name} ({link.path})
                                </div>
                                <button onClick={() => handleRemoveNavLink(index)}>삭제</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 선택된 내비게이션 링크 편집 */}
            {navLinks.length > 0 && (
                <div className="nav-link-editor">
                    <h3>내비게이션 링크 편집: {navLinks[activeTab].name}</h3>
                    <div className="input-group">
                        <label>헤더</label>
                        <input
                            type="text"
                            value={navLinks[activeTab].header}
                            onChange={(e) => handleNavLinkChange(activeTab, 'header', e.target.value)}
                            placeholder="페이지 헤더 입력"
                        />
                    </div>
                    <div className="input-group">
                        <label>푸터</label>
                        <input
                            type="text"
                            value={navLinks[activeTab].footer}
                            onChange={(e) => handleNavLinkChange(activeTab, 'footer', e.target.value)}
                            placeholder="페이지 푸터 입력"
                        />
                    </div>
                    <div className="input-group">
                        <label>내용</label>
                        <textarea
                            value={navLinks[activeTab].content}
                            onChange={(e) => handleNavLinkChange(activeTab, 'content', e.target.value)}
                            placeholder="페이지 내용 입력"
                        />
                    </div>
                </div>
            )}

            <button onClick={handleSave} disabled={loading}>
                {loading ? '저장 중...' : '저장'}
            </button>

            {/* 미리보기 */}
            {navLinks.length > 0 && (
                <div className="preview-section">
                    <h2>미리보기: {navLinks[activeTab].name}</h2>
                    <header style={{ backgroundColor: '#f5f5f5', padding: '20px', textAlign: 'center' }}>
                        <h1>{navLinks[activeTab].header}</h1>
                        <nav>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {navLinks.map((link, index) => (
                                    <li key={index} style={{ display: 'inline', margin: '0 10px' }}>
                                        <a href={link.path} style={{ textDecoration: 'none', color: '#007bff' }}>
                                            {link.name}
                                        </a>
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
        </div>
    );
};

export default Editor;
