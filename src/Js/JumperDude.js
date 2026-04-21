import Entity from './Entity';
import HeartPickup from './HeartPickup';
import * as Phaser from 'phaser';

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
    
    // Colisión más estrecha para evitar amontonamiento (15% del ancho)
    // Ancho original: 28 * 3 = 84px, 15% = ~12px, offset para centrar
    const collisionWidth = 12; // 15% del ancho original
    const offsetX = (24 - collisionWidth) / 2; // Centrar colisión
    this.body.setSize(collisionWidth, 47);
    this.body.setOffset(offsetX, 0);
    
    this.hp = 1000;
    this.touch = false;
    this.alive = true;
    this.damage = 50;
    this.fell = false;    
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
  fall() {
    if (!this.fell) {
    this.fell = true;
    
    
    
    this.die();  // Llama al método die existente
    }
  }

  // this.x < this.scene.cameras.main.scrollX + this.scene.sys.game.canvas.width - 50
  update() {
    // Verificar si el enemigo cayó (muerte por caída - coordenada Y > 750)
    if (this.y> 750 ){
      this.fall();
     }
    
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
    // Si ya está muerto, no aplicar daño
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
    this.scene.score+= 2000;
    this.scene.scoreText.setText(`Score: ${this.scene.score}`);
    this.setActive(false);
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.setGravityY(0);
    this.body.enable = false;

    // Spawnear un corazón en la posición del enemigo
    if (this.scene && this.scene.physics && this.scene.heartsGroup) {
      const heart = new HeartPickup(this.scene, this.x, this.y);
      this.scene.heartsGroup.add(heart);
    }

    // Añadir puntuación por matar JumperDude (2000 puntos)
    if (this.scene && this.scene.score !== undefined && this.scene.scoreText) {
      this.scene.score += 2000;
      this.scene.scoreText.setText(`Score: ${this.scene.score}`);
    }

    setTimeout(() => {
      this.setVisible(false);
    }, 3000);
  }
}

export default JumperDude;