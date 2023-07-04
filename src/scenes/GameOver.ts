import Phaser from 'phaser';
import SceneKeys from '~/constants/SceneKeys';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GameOverScene);
  }

  create() {
    const { width, height } = this.scale;
    const x = width * 0.5;
    const y = height * 0.9;

    this.add
      .text(x, y, 'Press SPACE to play again', {
        fontSize: '32px',
        color: '#FFFFFF',
        backgroundColor: '#000000',
        shadow: { fill: true, blur: 0, offsetY: 0 },
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
      })
      .setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.stop(SceneKeys.GameOverScene);
      this.scene.stop(SceneKeys.GameScene);
      this.scene.stop(SceneKeys.Leaderboard);
      this.scene.start(SceneKeys.GameScene);
    });
  }
}
