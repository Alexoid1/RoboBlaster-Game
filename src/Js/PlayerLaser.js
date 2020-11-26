import Laser from './Laser';

class PlayerLaser extends Laser {
  constructor(scene,x,y) {
    super(scene,x,y,'blast');
    
    
    this.setActive(true)
    this.setVisible(true)
    

    // this.time.addEvent({
    //   delay: 100,
    //   callback: function() {
    //     var enemy = new GunShip(
    //       this,
    //       Phaser.Math.Between(0, this.game.config.width),
    //       0
    //     );
    //     this.enemies.add(enemy);
    //   },
    //   callbackScope: this,
    //   loop: true
    // });
    
    // this.body.velocity.y = -200;
  }
  
  
}   

export default PlayerLaser;