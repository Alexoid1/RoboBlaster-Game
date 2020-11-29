/* eslint-disable no-undef */
import Phaser from 'phaser';

export default class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setTexture(key);
  }

  fire(x, y) {
    this.body.reset(x, y);

    this.body.setSize(200, 207);

    this.body.enable = true;
    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(900);
  }
}