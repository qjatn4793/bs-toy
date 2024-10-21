// WebsiteNameInput.js
import React from 'react';

const WebsiteNameInput = ({ websiteName, setWebsiteName }) => (
    <div className="input-group">
        <label>홈페이지 이름: </label>
        <input
            type="text"
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
            placeholder="홈페이지 이름"
        />
    </div>
);

export default WebsiteNameInput;
