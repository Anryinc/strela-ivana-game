import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { AimScene } from './scenes/AimScene.js';
import { FlightScene } from './scenes/FlightScene.js';
import { ResultScene } from './scenes/ResultScene.js';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#2d3436',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [BootScene, MenuScene, AimScene, FlightScene, ResultScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);

// Глобальное состояние игры
window.gameState = {
  currentLevel: 1, // 1 - старший, 2 - средний, 3 - Иван
  completedLevels: [],
  lastHitObject: null, // что попали при провале
  lastResult: null,    // 'success' | 'fail' | 'secret'
  boosts: {
    shield: 0,
    dash: 0,
    slowmo: 0
  }
};
