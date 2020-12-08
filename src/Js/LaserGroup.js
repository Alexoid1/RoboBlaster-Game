import Phaser from 'phaser';
import Laser from './Laser';

export default class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      classType: Laser,
      frameQuantity: 1,
      active: false,
      visible: false,
      loop: true,
      key: 'blast',
    });
  }

  fireLaser(x, y) {
    const laser = this.getFirstDead(false);
    if (laser) {
      laser.fire(x, y);
      laser.setScale(0.6);

      laser.anims.play('blast');
    }
  }
}