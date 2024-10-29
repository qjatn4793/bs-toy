import React, { useState } from 'react';
import styles from './styles/TurnBasedRPG.module.css';

const Battle = ({ player, setPlayer, enemy, setEnemy, onBattleEnd }) => {
  const [message, setMessage] = useState('');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const attackEnemy = () => {
    if (isPlayerTurn) {
      setEnemy((prev) => {
        const newHealth = prev.health - player.attack;
        return { ...prev, health: Math.max(newHealth, 0) };
      });
      setMessage(`You attacked ${enemy.name} for ${player.attack} damage.`);
      setIsPlayerTurn(false);
    }
  };

  const enemyAttack = () => {
    // 방어력에 따른 피해 계산
    const damage = Math.max(enemy.attack - player.defense, 0); // 방어력이 높은 경우 피해 0
    setPlayer((prev) => {
      const newHealth = prev.health - damage;
      return { ...prev, health: Math.max(newHealth, 0) };
    });
    setMessage(`${enemy.name} attacked you for ${damage} damage.`);
    setIsPlayerTurn(true);
  };

  const handleNextTurn = () => {
    if (enemy.health > 0 && player.health > 0) {
      if (!isPlayerTurn) {
        enemyAttack();
      }
    } else {
      if (player.health <= 0) {
        setMessage('You have been defeated!');
        onBattleEnd(false); // Game over
      } else if (enemy.health <= 0) {
        setMessage(`${enemy.name} has been defeated!`);
        onBattleEnd(true); // Battle won
      }
    }
  };

  return (
    <div className={styles.battleContainer}>
      <h2>{enemy.name}</h2>
      <p>Health: {enemy.health}</p>
      <button onClick={attackEnemy} disabled={!isPlayerTurn || enemy.health <= 0}>
        Attack
      </button>
      <button onClick={handleNextTurn} disabled={isPlayerTurn || player.health <= 0}>
        End Turn
      </button>
      <p>{message}</p>
    </div>
  );
};

export default Battle;
