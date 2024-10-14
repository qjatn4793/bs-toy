import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

const WebsiteList = () => {
  const [websites, setWebsites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!user) {
        return; // 유저가 없으면 함수 종료
      }
  
      try {
        const response = await axiosInstance.get(`/api/websites/${user.id}`);
        setWebsites(response.data);
      } catch (error) {
        console.error('Error fetching websites:', error);
      }
    };
  
    fetchWebsites();
  }, [user]);

  return (
    <div>
      <h1>My Websites</h1>
      <ul>
        {websites.map((website) => (
          <li key={website.id}>
            <h3>{website.headerContent}</h3>
            <p>{website.mainContent}</p>
            <footer>{website.footerContent}</footer>
            {website.imageUrl && (
              <img src={website.imageUrl} alt="Website" style={{ width: '100px', height: '100px' }} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebsiteList;
