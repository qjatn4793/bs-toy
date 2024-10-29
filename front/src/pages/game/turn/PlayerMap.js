import React from 'react';
import styles from './styles/PlayerMap.module.css';

const PlayerMap = ({ currentMapIndex, playerPosition }) => {
  return (
    <div className={styles.playerMapContainer}>
      <h3>Current Position on Map: {`(X: ${playerPosition.x}, Y: ${playerPosition.y})`}</h3>
      <h4>Current Map: {currentMapIndex + 1}</h4>
      <div className={styles.playerMap}>
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {Array.from({ length: 10 }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`${styles.cell} ${playerPosition.x === colIndex && playerPosition.y === rowIndex ? styles.player : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerMap;