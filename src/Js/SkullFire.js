import Entity from './Entity';
import * as Phaser from 'phaser';

/**
 * Clase que representa un enemigo perseguidor
 * Sigue al jugador cuando está dentro de su rango de detección
 */
class SkullFire extends Entity {
  constructor(config) {
    super({
      ...config,
      texture: 'fireSkull',
    });

    this.jumpHeight = 600;  // Altura máxima de salto

    // Configuración física del enemigo
    this.body.setSize(28, 28);
    
    this.setScale(3);
    
    // Colisión más estrecha para evitar amontonamiento (15% del ancho)
    // Ancho original: 28 * 3 = 84px, 15% = ~12px, offset para centrar
    const collisionWidth = 12; // 15% del ancho original
    const offsetX = (10 - collisionWidth) / 2; // Centrar colisión
    this.body.setSize(28, 28);
    this.body.setOffset(offsetX, 0);
    
    // Estadísticas del enemigo
    this.hp = 1300;          // Puntos de vida
    this.touch = false;      // Indica si está siendo dañado
    this.alive = true;       // Estado de vida
    this.damage = 50;
    this.fell = false;          // Daño que inflige al jugador
  }

  /**
   * Método que hace que el enemigo persiga al jugador
   * Se mueve hacia la posición del jugador
   */
  huntPlayer() {
    if (this.x < this.scene.player.x) {
      // Mueve hacia la derecha (jugador está a la derecha)
      this.body.setVelocityY(160);
      this.setFlipX(true);  // Voltea el sprite
    } else {
      // Mueve hacia la izquierda (jugador está a la izquierda)
      this.body.setVelocityX(-160);
      this.setFlipX(false); // Restaura orientación
    }
  }
  // Nueva propiedad
// Añadir método para marcar como caído
  fall() {
    if (!this.fell) {
    this.fell = true;
    this.die();  // Llama al método die existente
    }
  }

  /**
   * Método update de Phaser - Se ejecuta en cada frame
   * Decide si perseguir al jugador o mantenerse en reposo
   */
  update() {
    // Calcula distancia al jugador
    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.x, this.y, 
      this.scene.player.x, this.scene.player.y
    );
    
    // Si el jugador está dentro del rango de detección (580px), lo persigue
    if (distanceToPlayer < 780) {
      this.huntPlayer();
      
    } else {
      // Reproduce animación de reposo
      this.play('dudeleft');
    }

    if (this.y> 750 ){
      this.fall();
     }
  }

  /**
   * Aplica daño al enemigo
   * @param {number} damage - Cantidad de daño a aplicar
   */
  damg(damage) {
    return this.damageOrKill(damage);
  }

  /**
   * Aplica daño al enemigo y verifica si muere
   * @param {number} damage - Cantidad de daño a aplicar
   * @returns {boolean} - True si el enemigo murió, false si sobrevivió
   */
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

  /**
   * Mata al enemigo, aplica efectos visuales y lo desactiva
   */
  die() {
    // Efecto visual de muerte (tinte negro)
    this.setTint('#000');
    this.scene.score+= 2000;
    
    this.scene.scoreText.setText(`Score: ${this.scene.score}`);
    this.setActive(false);
   
    // Detiene movimiento y física
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.setGravityY(0);
    this.body.enable = false;

    // Hace invisible después de 3 segundos
    setTimeout(() => {
      this.setVisible(false);
    }, 3000);
  }
}

export default ChaserDude;