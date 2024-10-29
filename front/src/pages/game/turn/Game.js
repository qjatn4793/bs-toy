import React, { useState } from 'react';
import Map from './Map';
import TurnBasedRPG from './TurnBasedRPG';
import usePlayer from './Player';
import { EQUIPMENT_ITEMS } from './Item';

const Game = () => {
  const [inBattle, setInBattle] = useState(false);
  const [player, setPlayer, knockDownMonster, resetPlayer, movePlayer] = usePlayer();
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleEncounter = (enemy) => {
    setCurrentEnemy(enemy);
    setInBattle(true);
  };

  const handleBattleEnd = (won) => {
    setInBattle(false);
    if (won) {
      knockDownMonster(currentEnemy);
    } else {
      alert("Game Over! You have been defeated.");
      setGameOver(true);
    }
  };

  const handleMapChange = (newIndex) => {
    if (newIndex >= 0 && newIndex < 14) {
      setCurrentMapIndex(newIndex);
      setInBattle(false);
    }
  };

  // 장비를 장착하는 함수
  const equipItem = (slot, item) => {
    const newEquipment = {
      ...player.equipment,
      [slot]: item,
    };

    // 새로운 능력치 계산
    const newAttack = newEquipment.weapon ? player.attack + newEquipment.weapon.attack : player.attack;
    const newDefense = (newEquipment.helmet ? newEquipment.helmet.defense : 0) +
                       (newEquipment.armor ? newEquipment.armor.defense : 0) +
                       (newEquipment.shield ? newEquipment.shield.defense : 0);
    const newSpeed = newEquipment.boots ? player.speed + newEquipment.boots.speed : player.speed;

    setPlayer((prev) => ({
      ...prev,
      equipment: newEquipment,
      attack: newAttack,
      defense: newDefense,
      speed: newSpeed,
    }));
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '20px' }}>
        <h3>Equipment</h3>
        <div>
          <label>Helmet:</label>
          <select onChange={(e) => equipItem('helmet', EQUIPMENT_ITEMS.helmet[e.target.value])}>
            <option value="">Select Helmet</option>
            {EQUIPMENT_ITEMS.helmet.map((item, index) => (
              <option key={index} value={index}>{item.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Armor:</label>
          <select onChange={(e) => equipItem('armor', EQUIPMENT_ITEMS.armor[e.target.value])}>
            <option value="">Select Armor</option>
            {EQUIPMENT_ITEMS.armor.map((item, index) => (
              <option key={index} value={index}>{item.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Gloves:</label>
          <select onChange={(e) => equipItem('gloves', EQUIPMENT_ITEMS.gloves[e.target.value])}>
            <option value="">Select Gloves</option>
            {EQUIPMENT_ITEMS.gloves.map((item, index) => (
              <option key={index} value={index}>{item.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Weapon:</label>
          <select onChange={(e) => equipItem('weapon', EQUIPMENT_ITEMS.weapon[e.target.value])}>
            <option value="">Select Weapon</option>
            {EQUIPMENT_ITEMS.weapon.map((item, index) => (
              <option key={index} value={index}>{item.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Shield:</label>
          <select onChange={(e) => equipItem('shield', EQUIPMENT_ITEMS.shield[e.target.value])}>
            <option value="">Select Shield</option>
            {EQUIPMENT_ITEMS.shield.map((item, index) => (
              <option key={index} value={index}>{item.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Boots:</label>
          <select onChange={(e) => equipItem('boots', EQUIPMENT_ITEMS.boots[e.target.value])}>
            <option value="">Select Boots</option>
            {EQUIPMENT_ITEMS.boots.map((item, index) => (
              <option key={index} value={index}>{item.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        {!inBattle ? (
          <Map
            currentMapIndex={currentMapIndex}
            onEncounter={handleEncounter}
            onMapChange={handleMapChange}
          />
        ) : (
          <TurnBasedRPG player={player} setPlayer={setPlayer} enemy={currentEnemy} onBattleEnd={handleBattleEnd} />
        )}
        <div>
          <p>Player Position: {`(${player.position.x}, ${player.position.y})`}</p>
          <p>Level: {player.level}</p>
          <p>Experience: {player.experience}</p>
          <p>Health: {player.health}</p>
          <p>Max Health: {player.maxHealth}</p>
          <p>Attack: {player.attack}</p>
          <p>Defense: {player.defense}</p>
          <p>Gold: {player.gold}</p>
        </div>
      </div>
    </div>
  );
};

export default Game;
