import Laser from './Laser';
import Phaser from 'phaser';



export default class LaserGroup extends Phaser.Physics.Arcade.Group{
  
  constructor(scene) {
    super(scene.physics.world,scene);
    
    this.createMultiple({
        classType:Laser,
        frameQuantity:1,
        active:false,
        visible:false,
        loop: true,
        key: 'blast'
    })
 
   
  }

  fireLaser(x,y){
      const laser=this.getFirstDead(false);
      if(laser){
          laser.fire(x,y)
          laser.setScale(0.8)
          laser.body.setSize(170,237)
          laser.anims.play('blast')
        }

    }
 

}