import React, { useState, useEffect, useCallback } from 'react';
import './SnakeGame.module.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 8, y: 8 }];
const INITIAL_FOOD = { x: 12, y: 12 };

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);

  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  }, [direction]);

  const checkCollision = (head) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true; // 벽에 충돌
    }
    for (const segment of snake) {
      if (segment.x === head.x && segment.y === head.y) {
        return true; // 자신의 몸과 충돌
      }
    }
    return false;
  };

  const moveSnake = () => {
    const newSnake = [...snake];
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    if (checkCollision(newHead)) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection({ x: 1, y: 0 });
    setIsGameOver(false);
  };

  useEffect(() => {
    if (isGameOver) return;

    const intervalId = setInterval(moveSnake, 200);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moveSnake, handleKeyDown, isGameOver]);

  return (
    <div>
      <h2>Snake Game</h2>
      {isGameOver ? (
        <div className="game-over">
          Game Over!
          <button onClick={restartGame}>Restart</button>
        </div>
      ) : null}
      <div className="grid">
        {Array.from({ length: GRID_SIZE }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: GRID_SIZE }).map((_, colIndex) => {
              const isSnake = snake.some(segment => segment.x === colIndex && segment.y === rowIndex);
              const isFood = food.x === colIndex && food.y === rowIndex;
              return (
                <div
                  key={colIndex}
                  className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SnakeGame;
