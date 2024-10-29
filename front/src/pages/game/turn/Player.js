import { useState, useEffect } from 'react';

const initialPlayerState = {
  name: 'Hero',
  level: 1,
  experience: 0,
  health: 100,
  maxHealth: 100,
  attack: 30,
  defense: 0,
  gold: 0,
  position: { x: 0, y: 0 },
  equipment: {
    helmet: null,
    armor: null,
    gloves: null,
    weapon: null,
    shield: null,
    boots: null,
  },
};

const usePlayer = () => {
  const [player, setPlayer] = useState(initialPlayerState);

  const knockDownMonster = (enemy) => {
    const newExperience = player.experience + enemy.experience;
    const newLevel = Math.floor(newExperience / 100) + 1;
  
    // 레벨이 2 이상일 때에만 추가된 최대 체력과 공격력 적용
    const levelUpMaxHealth = 100 + (newLevel > 1 ? (newLevel * 10) : 0);
    const levelUpAttack = 20 + (newLevel > 1 ? (newLevel * 2) : 0);

    // 드롭할 금화 계산
    const goldDropped = dropGold(enemy); // enemy를 인자로 받도록 수정
  
    setPlayer((prev) => ({
      ...prev,
      experience: newExperience,
      level: newLevel,
      maxHealth: levelUpMaxHealth,
      health: levelUpMaxHealth, // 체력을 최대치로 설정하여 회복
      attack: levelUpAttack,
      gold: prev.gold + goldDropped
    }));
  };

  // 금화를 랜덤으로 드롭하는 함수
  const dropGold = (enemy) => {
    const { minGold, maxGold } = enemy;
    return Math.floor(Math.random() * (maxGold - minGold + 1)) + minGold;
  };

  const resetPlayer = () => {
    setPlayer(initialPlayerState); // 초기 상태로 리셋
  };

  const movePlayer = (dx, dy) => {
    setPlayer((prev) => ({
      ...prev,
      position: {
        x: Math.max(0, Math.min(prev.position.x + dx, 9)), // 0~9 범위로 제한
        y: Math.max(0, Math.min(prev.position.y + dy, 9)), // 0~9 범위로 제한
      },
    }));
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        movePlayer(0, -1);
        break;
      case 'ArrowDown':
        movePlayer(0, 1);
        break;
      case 'ArrowLeft':
        movePlayer(-1, 0);
        break;
      case 'ArrowRight':
        movePlayer(1, 0);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // 키보드 이벤트 리스너 추가
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // 컴포넌트 언마운트 시 리스너 제거
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return [player, setPlayer, knockDownMonster, resetPlayer, movePlayer];
};

export default usePlayer;
