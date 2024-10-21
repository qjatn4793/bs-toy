// NavLinkInput.js
import React from 'react';

const NavLinkInput = ({ newNavLink, setNewNavLink, handleAddNavLink }) => (
    <div>
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
    </div>
);

export default NavLinkInput;
