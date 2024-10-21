// NavLinkEditor.js
import React from 'react';

const NavLinkEditor = ({ navLinks, activeTab, handleNavLinkChange }) => (
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
);

export default NavLinkEditor;
