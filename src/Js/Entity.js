/* eslint-disable no-undef */
import Phaser from 'phaser';

export default class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.setTexture(config.texture);
  }
}
