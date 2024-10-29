import React, { useState, useEffect } from 'react';
import styles from './styles/TurnBasedRPG.module.css';

const TurnBasedRPG = ({ player, setPlayer, enemy, onBattleEnd }) => {
  const [enemyHealth, setEnemyHealth] = useState(enemy.health);
  const [message, setMessage] = useState('');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    setEnemyHealth(enemy.health); // enemy prop이 변경될 때마다 체력을 업데이트
  }, [enemy]);

  const attackEnemy = () => {
    if (isPlayerTurn && enemy) {
      // 적에게 공격
      const newHealth = enemyHealth - player.attack;
      setEnemyHealth(newHealth); // 적의 체력 업데이트

      if (newHealth <= 0) {
        setMessage(`You defeated ${enemy.name}!`);
        onBattleEnd(true, enemy); // 전투 종료 및 승리 처리
      } else {
        setMessage(`You attacked ${enemy.name} for ${player.attack} damage.`);
        setIsPlayerTurn(false); // 턴 변경
      }
    }
  };

  const enemyAttack = () => {
    if (enemy) {
      // 적이 공격
      const newHealth = player.health - enemy.attack;
      const updatedPlayer = {
        ...player,
        health: Math.max(newHealth, 0), // 체력이 0 이하로 떨어지지 않도록
      };
      setPlayer(updatedPlayer);

      setMessage(`${enemy.name} attacked you for ${enemy.attack} damage.`);
      setIsPlayerTurn(true); // 턴 변경
    }
  };

  const handleNextTurn = () => {
    if (player.health > 0 && enemyHealth > 0) {
      if (!isPlayerTurn) {
        enemyAttack();
      }
    } else {
      if (player.health <= 0) {
        setMessage('You have been defeated!'); // 게임 오버 메시지
        onBattleEnd(false, enemy); // 패배 처리
      }
    }
  };

  return (
    <div className={styles.gameContainer}>
      <h1>Turn-Based RPG</h1>
      <div className={styles.status}>
        <h2>{player.name}</h2>
        <p>Health: {player.health}</p>
        <h2>{enemy.name}</h2>
        <p>Health: {enemyHealth}</p> {/* 적의 체력 표시 */}
      </div>
      <button onClick={attackEnemy} disabled={!isPlayerTurn || enemyHealth <= 0} className={styles.button}>
        Attack {enemy.name}
      </button>
      <button onClick={handleNextTurn} className={styles.button}>
        End Turn
      </button>
      <p>{message}</p>
    </div>
  );
};

export default TurnBasedRPG;
