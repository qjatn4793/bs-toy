// NavLinkList.js
import React from 'react';

const NavLinkList = ({ navLinks, activeTab, setActiveTab, handleRemoveNavLink }) => (
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
);

export default NavLinkList;
