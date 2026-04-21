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
    this.body.setSize(177, 210);
    this.setScale(0.5);
    this.setGravityY(520);
    this.setCollideWorldBounds(true);  // Colisionar con límites del mundo
    
    // Estadísticas del jugador - Sistema de corazones
    this.maxHearts = 3;      // Máximo de corazones
    this.hearts = 3;         // Corazones actuales (3 corazones completos = 6 medios)
    this.isInvulnerable = false; // Estado de invulnerabilidad
    this.invulnerabilityTimer = null; // Temporizador de invulnerabilidad
    this.alive = true;       // Estado de vida
    this.damage = 10;        // Daño base del jugador
    
    // Sistema de doble salto
    this.jumpsAvailable = 2; // Saltos disponibles (doble salto)
    this.jumpForce = -470;   // Fuerza del primer salto
    this.doubleJumpForce = -350; // Fuerza del segundo salto (más alto que la mitad)
    this.wasOnGround = true; // Para detectar cuando toca el suelo
  }

  /**
   * Aplica daño al jugador (medio corazón por defecto)
   * @param {number} damageType - 0.5 para medio corazón, 1 para corazón completo
   */
  damg(damageType = 0.5) {
    return this.damageOrKill(damageType);
  }

  /**
   * Aplica daño al jugador usando sistema de corazones
   * @param {number} damageType - 0.5 para medio corazón, 1 para corazón completo
   * @returns {boolean} - True si el jugador murió, false si sobrevivió
   */
  damageOrKill(damageType = 0.5) {
    // Si el jugador es invulnerable, no recibe daño
    if (this.isInvulnerable) {
      return false;
    }
    
    // Aplicar daño (0.5 = medio corazón, 1 = corazón completo)
    this.hearts -= damageType;
    
    // Si se queda sin corazones, muere
    if (this.hearts <= 0) {
      this.die();
      return true;
    }
    
    // Activar invulnerabilidad por 3 segundos
    this.activateInvulnerability(3000);
    
    return false;
  }
  
  /**
   * Activa la invulnerabilidad por un tiempo determinado
   * @param {number} duration - Duración en milisegundos
   */
  activateInvulnerability(duration) {
    this.isInvulnerable = true;
    
    // Parpadeo visual durante invulnerabilidad
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: Math.floor(duration / 200) - 1,
      onComplete: () => {
        this.setAlpha(1);
      }
    });
    
    // Desactivar invulnerabilidad después del tiempo
    if (this.invulnerabilityTimer) {
      this.invulnerabilityTimer.remove();
    }
    
    this.invulnerabilityTimer = this.scene.time.delayedCall(duration, () => {
      this.isInvulnerable = false;
      this.invulnerabilityTimer = null;
    });
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
  
  /**
   * Añade un corazón al jugador (máximo maxHearts)
   * @returns {boolean} - True si se añadió un corazón, false si ya está al máximo
   */
  addHeart() {
    if (this.hearts < this.maxHearts) {
      this.hearts += 1;
      return true;
    }
    return false;
  }
  
  /**
   * Método update llamado cada frame
   */
  update() {
    // Método vacío por ahora, pero necesario para evitar errores
  }
}

export default Player;