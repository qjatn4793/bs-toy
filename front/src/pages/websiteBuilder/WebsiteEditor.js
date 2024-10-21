import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import WebsiteNameInput from './components/WebsiteNameInput';
import NavLinkInput from './components/NavLinkInput';
import NavLinkList from './components/NavLinkList';
import NavLinkEditor from './components/NavLinkEditor';
import Preview from './components/Preview';
import '../../styles/css/WebsiteEditor.css';

const WebsiteEditor = () => {
    const [navLinks, setNavLinks] = useState([]);
    const [newNavLink, setNewNavLink] = useState({ name: '', path: '', header: '', footer: '', content: '' });
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [websiteName, setWebsiteName] = useState('');
    const navigate = useNavigate();

    const handleAddNavLink = () => {
        if (newNavLink.name && newNavLink.path) {
            setNavLinks([...navLinks, newNavLink]);
            setNewNavLink({ name: '', path: '', header: '', footer: '', content: '' });
        } else {
            alert('링크 이름과 경로를 입력해주세요.');
        }
    };

    const handleNavLinkChange = (index, key, value) => {
        const updatedLinks = [...navLinks];
        updatedLinks[index][key] = value;
        setNavLinks(updatedLinks);
    };

    const handleRemoveNavLink = (index) => {
        const updatedLinks = navLinks.filter((_, i) => i !== index);
        setNavLinks(updatedLinks);
        setActiveTab(0);
    };

    const handleSave = async () => {
        if (!user) {
            alert('로그인 후 저장할 수 있습니다.');
            return;
        }

        if (!websiteName || navLinks.length === 0) {
            alert('웹사이트 이름과 최소 하나의 내비게이션 링크를 추가해주세요.');
            return;
        }

        for (const link of navLinks) {
            if (!link.name || !link.path || !link.header || !link.footer || !link.content) {
                alert('모든 내비게이션 링크의 필드를 채워주세요.');
                return;
            }
        }

        const websiteData = {
            userId: user.id,
            userName: user.username,
            websiteName,
            navLinks,
        };

        try {
            setLoading(true);
            const response = await axiosInstance.post(`/api/websites/save`, websiteData);

            if (response.status === 200 || response.status === 201) {
                alert('Website saved successfully');
                setNavLinks([]);
            } else {
                alert('Failed to save website');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // 대시보드로 이동하는 핸들러
    const handleDashboardClick = () => {
        navigate('/website-builder'); // 대시보드 페이지로 이동
    };

    return (
        <div className="website-editor-container">
            <h1>Website Editor</h1>
            <button onClick={handleDashboardClick}>Go to Dashboard</button>
            <WebsiteNameInput websiteName={websiteName} setWebsiteName={setWebsiteName} />

            <NavLinkInput
                newNavLink={newNavLink}
                setNewNavLink={setNewNavLink}
                handleAddNavLink={handleAddNavLink}
            />

            <NavLinkList
                navLinks={navLinks}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleRemoveNavLink={handleRemoveNavLink}
            />

            {navLinks.length > 0 && (
                <NavLinkEditor
                    navLinks={navLinks}
                    activeTab={activeTab}
                    handleNavLinkChange={handleNavLinkChange}
                />
            )}

            {navLinks.length > 0 && <Preview navLinks={navLinks} activeTab={activeTab} />}

            <button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Website'}
            </button>
        </div>
    );
};

export default WebsiteEditor;
