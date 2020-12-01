import Entity from './Entity';

class ChaserDude extends Entity {
  constructor(config) {
    super({
      ...config,
      texture: 'dude',

    });

    this.jumpHeight = 600;

    this.body.setSize(28, 47);
    this.setGravityY(800);
    this.setScale(3);
    this.hp = 1000;
    this.touch = false;
    this.alive = true;
    this.damage = 50;
  }



  huntPlayer() {
        
      if(this.x < this.scene.player.x){
        // this.play('dudeleft')
        this.body.setVelocityX(160);
        
        this.setFlipX(true);
      }else{
        // this.play('dudeleft')
        this.body.setVelocityX(-160);
       
        this.setFlipX(false);
        
      }
    // const headsOrTails = (Math.random() > 0.7);
    // this.jump(headsOrTails);
  }

  update() {
        // this.play('dudeleft')

    if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 580) {
        
        this.huntPlayer();
      
    }else{
        this.play('dudeleft')
        // this.body.setVelocityX(0)
        // this.play('turn')
    }
  }

  damg(damage) {
    this.damageOrKill(damage);
  }

  damageOrKill(damage) {
    this.touch = true;
    if (this.touch === true) {
      this.hp -= damage;
      if (this.hp <= 0) {
        this.die();
        return true;
      }
      this.touch = false;

      return false;
    }
    return false;
  }

  die() {
    this.setTint('#000');
    this.setActive(false);
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.setGravityY(0);
    this.body.enable = false;

    setTimeout(() => {
      this.setVisible(false);
    }, 3000);
  }
}

export default ChaserDude;