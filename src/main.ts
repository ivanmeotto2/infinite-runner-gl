import Phaser from 'phaser';

import GameScene from './scenes/Game';
import PreloaderScene from './scenes/Preloader';
import GameOverScene from './scenes/GameOver';
import Leaderboard from './scenes/Leaderboard';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  antialias: true,
  scene: [PreloaderScene, GameScene, GameOverScene, Leaderboard],
};

export default new Phaser.Game(config);
