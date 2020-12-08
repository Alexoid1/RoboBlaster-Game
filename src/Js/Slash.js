import Phaser from 'phaser';

export default class Slash extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setTexture(key);
  }

  blade(x, y) {
    this.body.reset(x, y);
    this.body.enable = true;
    this.setActive(true);
    this.setVisible(false);
  }
}