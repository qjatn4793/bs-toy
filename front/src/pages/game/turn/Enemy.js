import { useState, useEffect } from 'react';

// 각 타입에 따른 몬스터 초기화
const INITIAL_ENEMIES = {
  Slime: [
    { id: 1, name: 'Slime', health: 30, attack: 5, type: 'Slime', experience: 20, minGold: 1, maxGold: 5 },
  ],
  Skeleton: [
    { id: 2, name: 'Skeleton', health: 50, attack: 10, type: 'Skeleton', experience: 35, minGold: 5, maxGold: 10 },
  ],
  Orc: [
    { id: 3, name: 'Orc', health: 70, attack: 15, type: 'Orc', experience: 50, minGold: 10, maxGold: 15 },
  ],
  Giant: [
    { id: 4, name: 'Giant', health: 100, attack: 20, type: 'Giant', experience: 75, minGold: 15, maxGold: 25 },
  ],
  Lizard: [
    { id: 5, name: 'Lizard', health: 40, attack: 8, type: 'Lizard', experience: 25, minGold: 3, maxGold: 7 },
  ],
  Scorpion: [
    { id: 6, name: 'Scorpion', health: 60, attack: 12, type: 'Scorpion', experience: 40, minGold: 8, maxGold: 12 },
  ],
  IceGoblin: [
    { id: 7, name: 'IceGoblin', health: 50, attack: 10, type: 'IceGoblin', experience: 35, minGold: 6, maxGold: 11 },
  ],
  FireElemental: [
    { id: 8, name: 'FireElemental', health: 80, attack: 15, type: 'FireElemental', experience: 60, minGold: 10, maxGold: 20 },
  ],
  Zombie: [
    { id: 9, name: 'Zombie', health: 45, attack: 7, type: 'Zombie', experience: 30, minGold: 5, maxGold: 8 },
  ],
  Phantom: [
    { id: 10, name: 'Phantom', health: 65, attack: 14, type: 'Phantom', experience: 55, minGold: 7, maxGold: 13 },
  ],
  Dragon: [
    { id: 11, name: 'Dragon', health: 150, attack: 25, type: 'Dragon', experience: 100, minGold: 20, maxGold: 30 },
  ],
  Phoenix: [
    { id: 12, name: 'Phoenix', health: 120, attack: 22, type: 'Phoenix', experience: 85, minGold: 15, maxGold: 25 },
  ],
  Werewolf: [
    { id: 13, name: 'Werewolf', health: 75, attack: 18, type: 'Werewolf', experience: 65, minGold: 10, maxGold: 20 },
  ],
  Angel: [
    { id: 14, name: 'Angel', health: 90, attack: 20, type: 'Angel', experience: 70, minGold: 12, maxGold: 22 },
  ],
};

// 랜덤한 방향으로 이동하는 함수
const getRandomDirection = () => {
  const directions = [
    { dx: 0, dy: -1 }, // Up
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }, // Left
    { dx: 1, dy: 0 },  // Right
  ];
  return directions[Math.floor(Math.random() * directions.length)];
};

// 몬스터 랜덤 스폰 함수
const spawnRandomMonsters = (gridSize, enemyType, numberOfMonsters, existingPositions) => {
  const monsters = [];
  const initialEnemies = INITIAL_ENEMIES[enemyType] || [];
  
  while (monsters.length < numberOfMonsters) {
    const monster = initialEnemies[Math.floor(Math.random() * initialEnemies.length)];

    const position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };

    // 이미 존재하는 위치와 겹치지 않는지 확인
    if (!existingPositions.some(pos => pos.x === position.x && pos.y === position.y)) {
      monsters.push({
        ...monster,
        position,
      });
      existingPositions.push(position); // 위치 저장
    }
  }

  return monsters;
};

const useEnemies = (gridSize, enemyType) => {
  const [monsters, setMonsters] = useState([]);
  
  const spawnMonsters = (numberOfMonsters) => {
    const existingPositions = monsters.map(monster => monster.position); // 기존 몬스터 위치 저장
    const newMonsters = spawnRandomMonsters(gridSize, enemyType, numberOfMonsters, existingPositions);
    setMonsters(newMonsters);
  };

  const resetMonsters = () => {
    const numberOfMonsters = Math.floor(Math.random() * 5) + 1; // 1에서 5 사이의 랜덤한 몬스터 수
    spawnMonsters(numberOfMonsters);
  };

  const moveMonsters = () => {
    setMonsters((prevMonsters) => {
      return prevMonsters.map((monster) => {
        const { dx, dy } = getRandomDirection(); // 랜덤 방향 선택
        const newPosition = {
          x: Math.max(0, Math.min(monster.position.x + dx, gridSize - 1)),
          y: Math.max(0, Math.min(monster.position.y + dy, gridSize - 1)),
        };

        // 몬스터가 서로 겹치는지 확인
        const isCollision = prevMonsters.some(
          (m) => m.id !== monster.id && m.position.x === newPosition.x && m.position.y === newPosition.y
        );

        // 충돌이 없으면 새로운 위치로 이동
        if (!isCollision) {
          return { ...monster, position: newPosition };
        }
        return monster; // 충돌이 있다면 위치를 그대로 유지
      });
    });
  };

  // 초기화 및 스폰
  useEffect(() => {
    resetMonsters();
  }, [enemyType]);

  return [monsters, moveMonsters, resetMonsters];
};

export { useEnemies };
