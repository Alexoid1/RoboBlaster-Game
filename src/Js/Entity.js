import {GameObjects} from 'phaser';

const {Sprite} = GameObjects;

export default class Entity extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    // Add self to scene's physics
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    
    this.setTexture(config.texture);
    // this.maxHP = config.maxHP;
    // this.hp = this.maxHP;
  }
 
  // damageOrKill(damage) {
  //   this.hp -= damage;
  //   if (this.hp <= 0) {
  //     this.die();
  //     return true;
  //   }
  //   return false;
  // }

  // die() {
  //   this.setActive(false);
  //   this.setVisible(false);
  // }

}

