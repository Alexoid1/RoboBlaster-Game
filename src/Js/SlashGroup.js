import Phaser from 'phaser';
import Slash from './Slash';

export default class SlashGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
      super(scene.physics.world, scene);
  
      this.createMultiple({
        classType: Slash,
        frameQuantity: 1,
        active: false,
        visible: false,
        loop: true,
        key: 'groupS',
      });
    }
  
    bladeSlash(x, y) {
      const slash = this.getFirstDead(false);
      if (slash) {
        slash.blade(x, y-50);
        slash.setScale(1); 
        slash.setSize(195, 157);
        slash.anims.play('slash');
      }
    }
}