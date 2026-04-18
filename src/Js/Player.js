import Entity from './Entity';

/**
 * Clase que representa al jugador principal del juego
 * Extiende la clase Entity y maneja la salud, daño y estado del jugador
 */
class Player extends Entity {
  constructor(config) {
    super({
      ...config,
      texture: 'stand',
    });
    // Configuración física del jugador
    this.body.setSize(160, 200);
    this.setScale(0.5);
    this.setGravityY(520);
    this.setCollideWorldBounds(true);  // Colisionar con límites del mundo
    
    // Estadísticas del jugador
    this.hp = 1000;          // Puntos de vida
    this.touch = false;      // Indica si el jugador está siendo tocado/dañado
    this.alive = true;       // Estado de vida
    this.damage = 10;        // Daño base del jugador
  }

  /**
   * Aplica daño al jugador usando el daño base
   */
  damg() {
    this.damageOrKill(this.damage);
  }

  /**
   * Aplica daño al jugador y verifica si muere
   * @param {number} damage - Cantidad de daño a aplicar
   * @returns {boolean} - True si el jugador murió, false si sobrevivió
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
   * Mata al jugador, haciéndolo invisible
   */
  die() {
    this.setVisible(false);
  }
}

export default Player;