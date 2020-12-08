import Entity from './Entity';

class JumperDude extends Entity {
  constructor(config) {
    super({
      ...config,
      texture: 'dude',

    });

    this.jumpHeight = 600;

    this.body.setSize(28, 47);
    this.setGravityY(800);
    this.setScale(3);
    this.hp = 500;
    this.touch = false;
    this.alive = true;
    this.damage = 50;
  }

  jump(coinToss) {
    const randomVelocity = (Math.random() * 200);
    this.body.setVelocityY(-this.jumpHeight);
    this.setTint(0xFFFFFF);
    if (coinToss) {
      this.body.setVelocityX(randomVelocity);
      this.setFlipX(true);
    } else {
      this.body.setVelocityX(-randomVelocity);
      this.setFlipX(false);
    }
  }

  jumpRandom() {
    const headsOrTails = (Math.random() > 0.7);
    this.jump(headsOrTails);
  }

  // this.x < this.scene.cameras.main.scrollX + this.scene.sys.game.canvas.width - 50
  update() {
    if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 580) {
      if (this.body.blocked.down) {
        this.jumpRandom();
      }
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

export default JumperDude;