import AnimationKeys from '~/constants/AnimationKeys';
import SceneKeys from '~/constants/SceneKeys';
import TextureKeys from '~/constants/TextureKeys';

enum MouseState {
  Running,
  Killed,
  Dead,
}

export default class RocketMouse extends Phaser.GameObjects.Container {
  private flames: Phaser.GameObjects.Sprite;
  private mouse: Phaser.GameObjects.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private mouseState = MouseState.Running;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.mouse = scene.add.sprite(0, 0, 'rocket-mouse', 'rocketmouse_fly01.png').setOrigin(0.5, 1).play(AnimationKeys.RocketMouseRun);

    this.flames = scene.add.sprite(-63, -15, TextureKeys.RocketMouse).play(AnimationKeys.RocketFlamesOn);

    this.cursors = scene.input.keyboard.createCursorKeys();

    this.add(this.flames);
    this.add(this.mouse);

    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.mouse.width * 0.5, this.mouse.height * 0.7);
    body.setOffset(this.mouse.width * -0.3, -this.mouse.height + 15);
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    switch (this.mouseState) {
      case MouseState.Running: {
        if (this.cursors.space.isDown) {
          body.setVelocityY(-600);
          this.enableJetpack(true);
          this.mouse.play(AnimationKeys.RocketMouseFly, true);
        } else {
          body.setVelocityY(600);
          this.enableJetpack(false);
        }

        if (body.blocked.down) {
          this.mouse.play(AnimationKeys.RocketMouseRun, true);
        } else if (body.velocity.y > 0) {
          this.mouse.play(AnimationKeys.RocketMouseFall, true);
        }
        break;
      }
      case MouseState.Killed: {
        body.velocity.x *= 0.95;
        if (body.velocity.x <= 10) {
          this.mouseState = MouseState.Dead;
        }
        break;
      }
      case MouseState.Dead: {
        body.setVelocity(0, 1000);
        this.scene.scene.run(SceneKeys.GameOverScene);
        break;
      }
    }
  }

  enableJetpack(enabled: boolean) {
    this.flames.setVisible(enabled);
  }

  die() {
    if (this.mouseState !== MouseState.Running) {
      return;
    }
    this.mouseState = MouseState.Killed;
    this.mouse.play(AnimationKeys.RocketMouseDead);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAccelerationY(100);
    body.setVelocity(1000, 100);
    this.enableJetpack(false);
  }
}
