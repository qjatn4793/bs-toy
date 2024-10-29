import React, { useState, useEffect } from 'react';
import { useEnemies } from './Enemy'; // Enemy hook
import styles from './styles/Map.module.css';

const GRID_SIZE = 10;

// Define maps with portal positions that do not overlap with player positions
const INITIAL_MAPS = [
  {
    id: 1,
    name: 'Forest',
    monsterType: 'Slime',
    portalPositions: [{ x: 9, y: 0, targetMapIndex: 1 }],
  },
  {
    id: 2,
    name: 'Cave',
    monsterType: 'Skeleton',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 0 },
      { x: 9, y: 9, targetMapIndex: 2 },
    ],
  },
  {
    id: 3,
    name: 'Mountain',
    monsterType: 'Orc',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 1 },
      { x: 9, y: 9, targetMapIndex: 3 },
    ],
  },
  {
    id: 4,
    name: 'Tundra',
    monsterType: 'Giant',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 2 },
      { x: 9, y: 9, targetMapIndex: 4 },
    ],
  },
  {
    id: 5,
    name: 'Swamp',
    monsterType: 'Lizard',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 3 },
      { x: 9, y: 9, targetMapIndex: 5 },
    ],
  },
  {
    id: 6,
    name: 'Desert',
    monsterType: 'Scorpion',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 4 },
      { x: 9, y: 9, targetMapIndex: 6 },
    ],
  },
  {
    id: 7,
    name: 'Ice Cave',
    monsterType: 'IceGoblin',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 5 },
      { x: 9, y: 9, targetMapIndex: 7 },
    ],
  },
  {
    id: 8,
    name: 'Volcano',
    monsterType: 'FireElemental',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 6 },
      { x: 9, y: 9, targetMapIndex: 8 },
    ],
  },
  {
    id: 9,
    name: 'Abandoned Mine',
    monsterType: 'Zombie',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 7 },
      { x: 9, y: 9, targetMapIndex: 9 },
    ],
  },
  {
    id: 10,
    name: 'Ancient Ruins',
    monsterType: 'Phantom',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 8 },
      { x: 9, y: 9, targetMapIndex: 10 },
    ],
  },
  {
    id: 11,
    name: 'Hidden Valley',
    monsterType: 'Dragon',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 9 },
      { x: 9, y: 9, targetMapIndex: 11 },
    ],
  },
  {
    id: 12,
    name: 'Sky Island',
    monsterType: 'Phoenix',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 10 },
      { x: 9, y: 9, targetMapIndex: 12 },
    ],
  },
  {
    id: 13,
    name: 'Dark Forest',
    monsterType: 'Werewolf',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 11 },
      { x: 9, y: 9, targetMapIndex: 13 },
    ],
  },
  {
    id: 14,
    name: 'Elysium',
    monsterType: 'Angel',
    portalPositions: [
      { x: 9, y: 0, targetMapIndex: 12 }
    ],
  },
];

const Map = ({ currentMapIndex, onEncounter, onMapChange }) => {
  const validMapIndex = Math.max(0, Math.min(currentMapIndex, INITIAL_MAPS.length - 1));
  const currentMap = INITIAL_MAPS[validMapIndex];

  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 0 });
  const [monsters, moveMonsters, resetMonsters] = useEnemies(GRID_SIZE, currentMap.monsterType);

  useEffect(() => {
    const intervalId = setInterval(() => {
      moveMonsters();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [moveMonsters]);

  const movePlayer = (dx, dy) => {
    setPlayerPosition((prev) => ({
      x: Math.min(Math.max(prev.x + dx, 0), GRID_SIZE - 1),
      y: Math.min(Math.max(prev.y + dy, 0), GRID_SIZE - 1),
    }));
  };

  const checkEncounter = () => {
    for (const monster of monsters) {
      if (playerPosition.x === monster.position.x && playerPosition.y === monster.position.y) {
        onEncounter(monster);
        break;
      }
    }
  };

  const checkPortal = () => {
    const portalPositions = currentMap.portalPositions;

    console.log(portalPositions);

    for (const portal of portalPositions) {
      if (playerPosition.x === portal.x && playerPosition.y === portal.y) {
        onMapChange(portal.targetMapIndex);
        return;
      }
    }
  };

  useEffect(() => {
    checkEncounter();
    checkPortal();
  }, [playerPosition, monsters]);

  // Reset player position and monsters when the map changes
  useEffect(() => {
    setPlayerPosition({ x: 0, y: 0 });
    resetMonsters(); // Reset and spawn monsters for the new map
  }, [currentMapIndex]);

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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isPortalPositionValid = (portalPosition) => {
    return (
      portalPosition.x !== playerPosition.x ||
      portalPosition.y !== playerPosition.y
    );
  };

  const filteredPortalPositions = currentMap.portalPositions.filter(isPortalPositionValid);

  return (
    <div className={styles.mapContainer}>
      <h2 className={styles.mapTitle}>{currentMap.name}</h2>
      <div className={styles.gridContainer}>
        {Array.from({ length: GRID_SIZE }).map((_, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {Array.from({ length: GRID_SIZE }).map((_, colIndex) => {
              const isPlayer = playerPosition.x === colIndex && playerPosition.y === rowIndex;
              const monster = monsters.find((m) => m.position.x === colIndex && m.position.y === rowIndex);
              const isPortal = filteredPortalPositions.some(
                (portal) => portal.x === colIndex && portal.y === rowIndex
              );

              return (
                <div
                  key={colIndex}
                  className={`${styles.cell} ${isPlayer ? styles.player : ''} ${
                    monster ? styles[monster.type.toLowerCase()] : ''
                  } ${isPortal ? styles.portal : ''}`}
                >
                  {isPlayer && <span className={styles.playerMarker}>P</span>}
                  {monster && <span className={styles.monsterMarker}>{monster.type.charAt(0)}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button onClick={() => onMapChange(currentMapIndex - 1)} disabled={currentMapIndex === 0}>Previous Map</button>
        <button onClick={() => onMapChange(currentMapIndex + 1)} disabled={currentMapIndex === INITIAL_MAPS.length - 1}>Next Map</button>
      </div>
    </div>
  );
};

export default Map;
