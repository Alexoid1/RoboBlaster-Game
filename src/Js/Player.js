import Entity from './Entity';

class Player extends Entity {
  constructor(config) {
    super({
      ...config,

      texture: 'stand',
    });
    this.body.setSize(160, 200);
    this.setScale(0.5);
    this.setGravityY(520);
    this.hp = 500;
    this.touch = false;
    this.alive = true;
    this.damage = 10;
  }

  damg() {
    this.damageOrKill(this.damage);
  }

  damageOrKill(damage) {
    this.touch = true;
    if (this.touch === true) {
      this.hp -= damage;
      // this.alpha=true;
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
    this.setVisible(false);
  }
}

export default Player;