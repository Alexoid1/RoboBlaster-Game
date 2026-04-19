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
    
    // Sistema de doble salto
    this.jumpsAvailable = 2; // Saltos disponibles (doble salto)
    this.jumpForce = -470;   // Fuerza del primer salto
    this.doubleJumpForce = -350; // Fuerza del segundo salto (más alto que la mitad)
    this.wasOnGround = true; // Para detectar cuando toca el suelo
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

  /**
   * Actualiza el estado de los saltos disponibles
   * @param {boolean} onGround - Indica si el jugador está en el suelo
   */
  updateJumpState(onGround) {
    // Si acaba de tocar el suelo, reinicia los saltos
    if (onGround && !this.wasOnGround) {
      this.jumpsAvailable = 2;
    }
    this.wasOnGround = onGround;
  }

  /**
   * Intenta realizar un salto
   * @returns {boolean} - True si se realizó un salto, false si no hay saltos disponibles
   */
  tryJump() {
    if (this.jumpsAvailable > 0) {
      // Determina la fuerza del salto basado en cuál salto es
      const isDoubleJump = this.jumpsAvailable === 1;
      const jumpForce = isDoubleJump ? this.doubleJumpForce : this.jumpForce;
      
      this.setVelocityY(jumpForce);
      this.jumpsAvailable--;
      return true;
    }
    return false;
  }
}

export default Player;