import React, { useRef, useEffect, useState } from 'react';
import './SuperMarioGame.module.css';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GRAVITY = 0.1;
const JUMP_STRENGTH = 10;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;
const GROUND_HEIGHT = 20;
const MONSTER_WIDTH = 30;
const MONSTER_HEIGHT = 30;
const MONSTER_SPEED = 0.001; // 느리게 설정

const SuperMarioGame = () => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({
    x: 50,
    y: CANVAS_HEIGHT - PLAYER_HEIGHT - GROUND_HEIGHT,
    dy: 0,
  });
  const [isJumping, setIsJumping] = useState(false);
  const [monsters, setMonsters] = useState([
    { x: 300, y: CANVAS_HEIGHT - PLAYER_HEIGHT - GROUND_HEIGHT, direction: 1 },
  ]);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp' && !isJumping) {
      setPlayer((prev) => ({ ...prev, dy: -JUMP_STRENGTH }));
      setIsJumping(true);
    }
    if (event.key === 'ArrowLeft') {
      setPlayer((prev) => ({
        ...prev,
        x: Math.max(prev.x - 5, 0), // 왼쪽으로 이동
      }));
    }
    if (event.key === 'ArrowRight') {
      setPlayer((prev) => ({
        ...prev,
        x: Math.min(prev.x + 5, CANVAS_WIDTH - PLAYER_WIDTH), // 오른쪽으로 이동
      }));
    }
  };

  const updateMonsters = () => {
    setMonsters((prevMonsters) =>
      prevMonsters.map((monster) => {
        const newX = monster.x + monster.direction * MONSTER_SPEED;

        // 화면의 경계를 체크하여 방향 전환
        if (newX < 0 || newX > CANVAS_WIDTH - MONSTER_WIDTH) {
          monster.direction *= -1; // 방향 전환
        }

        return { ...monster, x: newX };
      })
    );
  };

  const checkCollision = () => {
    for (const monster of monsters) {
      if (
        player.x < monster.x + MONSTER_WIDTH &&
        player.x + PLAYER_WIDTH > monster.x &&
        player.y < monster.y + MONSTER_HEIGHT &&
        player.y + PLAYER_HEIGHT > monster.y
      ) {
        setIsGameOver(true); // 충돌 시 게임 오버
      }
    }
  };

  const update = () => {
    if (isGameOver) return;

    setPlayer((prev) => {
      let newY = prev.y + prev.dy;

      // 중력 적용
      if (newY < CANVAS_HEIGHT - PLAYER_HEIGHT - GROUND_HEIGHT) {
        return { ...prev, dy: prev.dy + GRAVITY, y: newY };
      } else {
        // 바닥에 도착한 경우
        setIsJumping(false); // 점프 상태 해제
        return { ...prev, dy: 0, y: CANVAS_HEIGHT - PLAYER_HEIGHT - GROUND_HEIGHT }; // 바닥 위치로 설정
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    document.addEventListener('keydown', handleKeyDown);

    const gameLoop = () => {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      update();
      updateMonsters();
      checkCollision();

      // 플레이어 그리기
      context.fillStyle = 'red';
      context.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);

      // 바닥 그리기
      context.fillStyle = 'green';
      context.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);

      // 몬스터 그리기
      context.fillStyle = 'blue';
      monsters.forEach((monster) => {
        context.fillRect(monster.x, monster.y, MONSTER_WIDTH, MONSTER_HEIGHT);
      });

      // 게임 오버 표시
      if (isGameOver) {
        context.fillStyle = 'black';
        context.font = '30px Arial';
        context.fillText('Game Over!', CANVAS_WIDTH / 2 - 70, CANVAS_HEIGHT / 2);
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [player, monsters, isGameOver]);

  return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />;
};

export default SuperMarioGame;