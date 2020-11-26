import Entity from './Entity';

class JumperDude extends Entity {
  constructor(config) {
    super({
      ...config,
      texture: 'dude',
    //   maxHP: 50
    });

    // Config
    // this.maxSpeed = 100;
    // this.jumpHeight = 600;

    // Setup physics properties
    this.body.setSize(28, 47);
    this.setGravityY(800);
    this.setScale(3);
    
    
    // this.setScale(0.35);
  }

  jump(coinToss) {
    const randomVelocity = (Math.random() * 200);
    this.body.setVelocityY(-600);
    if (coinToss) {
      this.body.setVelocityX(randomVelocity);
      this.setFlipX(true);
    }
    else {
      this.body.setVelocityX(-randomVelocity);
      this.setFlipX(false);
    }
  }
    jumpRandom() {
    const headsOrTails = (Math.random() > 0.5);
    this.jump(headsOrTails);
  }

// //   attack(mc) {
// //     this.jumpRandom();
// //     mc.hp--;
// //   }

    update() {
      if(this.x < this.scene.cameras.main.scrollX + this.scene.sys.game.canvas.width ){
        if (this.body.blocked.down) {
          this.jumpRandom();
        }
      }
      
    }
}

export default JumperDude;