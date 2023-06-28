import Phaser from 'phaser';

import GameScene from './scenes/Game';
import PreloaderScene from './scenes/Preloader';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: true,
    },
  },
  scene: [PreloaderScene, GameScene],
};

export default new Phaser.Game(config);
