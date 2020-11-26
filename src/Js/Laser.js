import {GameObjects} from 'phaser';

const {Sprite} = GameObjects;

export default class Laser extends Phaser.Physics.Arcade.Sprite{
  constructor(scene,x,y,key) {
    super(scene, x, y, key);

    // Add self to scene's physics
    scene.physics.world.enable(this);
    scene.add.existing(this);
    
    
    this.setTexture(key);
    
   
   
   
  }
  
  

  fire(x,y){
    this.body.reset(x,y)
    this.setScale(0.5)
    this.body.setSize(240,257)
    
    
    this.setActive(true);
		this.setVisible(true);

		this.setVelocityX(900);
  }

  // preUpdate(time,delta){
  //   super.preUpdate(time,delta)
  //   if(this.y<=0){
  //     this.setActive(false);
  //     this.setVisible(false)
  //   }
  // }
 

}