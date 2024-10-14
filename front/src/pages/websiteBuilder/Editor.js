import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import './Editor.css';

const Editor = () => {
    const [header, setHeader] = useState('');
    const [footer, setFooter] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [navLinks, setNavLinks] = useState([]); // 내비게이션 링크 상태
    const [navLinkName, setNavLinkName] = useState(''); // 내비게이션 링크 이름
    const [navLinkPath, setNavLinkPath] = useState(''); // 내비게이션 링크 경로
    const [pageContents, setPageContents] = useState([]); // 각 내비게이션 링크의 페이지 내용
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleAddNavLink = () => {
        // 최대 10개까지 내비게이션 링크 추가 가능
        if (navLinks.length < 10 && navLinkName && navLinkPath) {
            setNavLinks([...navLinks, { name: navLinkName, path: navLinkPath }]);
            setPageContents([...pageContents, '']); // 새로운 페이지 내용 추가
            setNavLinkName(''); // 입력 초기화
            setNavLinkPath(''); // 입력 초기화
        } else if (navLinks.length >= 10) {
            alert('최대 10개의 내비게이션 링크를 추가할 수 있습니다.');
        } else {
            alert('링크 이름과 경로를 입력해주세요.');
        }
    };

    const handleRemoveNavLink = (index) => {
        const updatedNavLinks = navLinks.filter((_, i) => i !== index);
        const updatedPageContents = pageContents.filter((_, i) => i !== index);
        setNavLinks(updatedNavLinks); // 선택한 내비게이션 링크 삭제
        setPageContents(updatedPageContents); // 선택한 페이지 내용 삭제
    };

    const handlePageContentChange = (index, content) => {
        const updatedContents = [...pageContents];
        updatedContents[index] = content;
        setPageContents(updatedContents);
    };

    const handleSave = async () => {
        if (!user) {
            alert('로그인 후 웹사이트를 저장할 수 있습니다.');
            return;
        }

        // 유효성 검사
        if (!header || !footer || !imageUrl || navLinks.length === 0) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        const websiteData = {
            userId: user.id,
            headerContent: header,
            footerContent: footer,
            imageUrl: imageUrl,
            navLinks: navLinks.map((link, index) => ({
                ...link,
                content: pageContents[index] // 각 링크에 대한 콘텐츠 추가
            })),
        };

        try {
            setLoading(true); // 로딩 상태 설정
            const response = await axiosInstance.post(`/api/websites/save`, websiteData);

            if (response.status === 200 || response.status === 201) {
                alert('Website saved successfully');
                // 입력 초기화
                setHeader('');
                setFooter('');
                setImageUrl('');
                setNavLinks([]); // 내비게이션 링크 초기화
                setPageContents([]); // 페이지 내용 초기화
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
            <h1>웹사이트 빌더</h1>
            {user ? (
                <div className="user-info">
                    <p>로그인 사용자: {user.username}</p>
                    <p>사용자 ID: {user.id}</p>
                </div>
            ) : (
                <p>로그인 후 웹사이트를 저장할 수 있습니다.</p>
            )}
            <div className="input-group">
                <label>헤더: </label>
                <input
                    type="text"
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                    placeholder="웹사이트 제목"
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
                    placeholder="이미지 URL"
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
                <label>내비게이션 링크 경로: </label>
                <input
                    type="text"
                    value={navLinkPath}
                    onChange={(e) => setNavLinkPath(e.target.value)}
                    placeholder="링크 경로"
                />
            </div>
            <button onClick={handleAddNavLink}>내비게이션 링크 추가</button>

            {/* 추가된 내비게이션 링크 리스트 */}
            <div className="nav-links-list">
                <h3>내비게이션 링크:</h3>
                <ul>
                    {navLinks.map((link, index) => (
                        <li key={index}>
                            {link.name} - {link.path}
                            <button onClick={() => handleRemoveNavLink(index)}>삭제</button>
                            
                            {/* 각 내비게이션 링크에 대한 내용 입력 섹션 */}
                            <div className="page-content">
                                <h4>페이지 내용 입력 ({link.name}):</h4>
                                <textarea
                                    value={pageContents[index] || ''}
                                    onChange={(e) => handlePageContentChange(index, e.target.value)}
                                    placeholder="페이지에 대한 내용을 입력하세요."
                                    style={{ width: '100%', height: '100px' }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <button onClick={handleSave} disabled={loading}>
                {loading ? '저장 중...' : '웹사이트 저장'}
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
                                        <a href={link.path} style={{ textDecoration: 'none', color: '#007bff' }}>
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </header>
                    <main style={{ padding: '20px' }}>
                        {navLinks.map((link, index) => (
                            <div key={index} id={link.path}>
                                <h2>{link.name}</h2>
                                <p>{pageContents[index]}</p>
                            </div>
                        ))}
                        {imageUrl && <img src={imageUrl} alt="웹사이트 이미지" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />}
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
