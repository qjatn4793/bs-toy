import React from 'react';

const GameOver = ({ onRestart }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Game Over</h1>
      <p>You have been defeated!</p>
      <button onClick={onRestart} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Restart Game
      </button>
    </div>
  );
};

export default GameOver;