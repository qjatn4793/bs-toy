// Preview.js
import React from 'react';

const Preview = ({ navLinks, activeTab }) => (
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
);

export default Preview;
