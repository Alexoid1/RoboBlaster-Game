import Entity from './Entity';

/**
 * Clase que representa un enemigo perseguidor
 * Sigue al jugador cuando está dentro de su rango de detección
 */
class ChaserDude extends Entity {
  constructor(config) {
    super({
      ...config,
      texture: 'dude',
    });

    this.jumpHeight = 600;  // Altura máxima de salto

    // Configuración física del enemigo
    this.body.setSize(28, 47);
    this.setGravityY(800);
    this.setScale(3);
    
    // Estadísticas del enemigo
    this.hp = 1000;          // Puntos de vida
    this.touch = false;      // Indica si está siendo dañado
    this.alive = true;       // Estado de vida
    this.damage = 50;        // Daño que inflige al jugador
  }

  /**
   * Método que hace que el enemigo persiga al jugador
   * Se mueve hacia la posición del jugador
   */
  huntPlayer() {
    if (this.x < this.scene.player.x) {
      // Mueve hacia la derecha (jugador está a la derecha)
      this.body.setVelocityX(160);
      this.setFlipX(true);  // Voltea el sprite
    } else {
      // Mueve hacia la izquierda (jugador está a la izquierda)
      this.body.setVelocityX(-160);
      this.setFlipX(false); // Restaura orientación
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
    if (distanceToPlayer < 580) {
      this.huntPlayer();
    } else {
      // Reproduce animación de reposo
      this.play('dudeleft');
    }
  }

  /**
   * Aplica daño al enemigo
   * @param {number} damage - Cantidad de daño a aplicar
   */
  damg(damage) {
    this.damageOrKill(damage);
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