import Laser from './Laser';
import Phaser from 'phaser';



export default class LaserGroup extends Phaser.Physics.Arcade.Group{
  constructor(scene) {
    super(scene.physics.world,scene);

    this.createMultiple({
        classType:Laser,
        frameQuantity:90,
        active:false,
        visible:false,
        key: 'blast'
    })
 
   
  }

  fireLaser(x,y){
      const laser=this.getFirstDead(false);
      if(laser){
          laser.fire(x,y)
          laser.anims.play('blast')
        }

    }
 

}