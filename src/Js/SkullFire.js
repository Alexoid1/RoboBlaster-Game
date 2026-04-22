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

    

    // Configuración física del enemigo
    this.body.setSize(28, 28);
    
    this.setScale(3);
    
    // Colisión más estrecha para evitar amontonamiento (15% del ancho)
    // Ancho original: 28 * 3 = 84px, 15% = ~12px, offset para centrar
    const collisionWidth = 12; // 15% del ancho original
    
    this.body.setSize(40, 40);
   
    
    // Estadísticas del enemigo
    this.hp = 1300;          // Puntos de vida
    this.touch = false;      // Indica si está siendo dañado
    this.alive = true;
     
    this.setGravityY(0);      // Estado de vida
    this.damage = 50;
    this.fell = false;
    this.floatSpeed = 60; // px/seg
    this.floatHeight = 100; // px
    this.startY = config.y;
    this.floatDirection = 1;
    this.setScale(2);         // Daño que inflige al jugador
  }

  /**
   * Método que hace que el enemigo persiga al jugador
   * Se mueve hacia la posición del jugador
   */
  moveC() {
    if (this.x - this.scene.player.x < 700 ) {
      // Mueve hacia la derecha (jugador está a la derecha)
      // Voltea el sprite
      if(this.y>this.startY-190){
        this.body.setAccelerationY(-this.floatSpeed)
      }else if(this.y<this.startY+130){
        this.body.setAccelerationY(this.floatSpeed)

      }

    } else {
      // Mueve hacia la izquierda (jugador está a la izquierda)
      
      this.body.setVelocityY(0);
      
    }
    
  }

  flipSkull(){
    if (this.x < this.scene.player.x) {
        // Mueve hacia la derecha (jugador está a la derecha)
       
        this.setFlipX(true);  // Voltea el sprite
      } else {
        // Mueve hacia la izquierda (jugador está a la izquierda)
    
        this.setFlipX(false); // Restaura orientación
      }
  }
  // Nueva propiedad
// Añadir método para marcar como caído
 

  /**
   * Método update de Phaser - Se ejecuta en cada frame
   * Decide si perseguir al jugador o mantenerse en reposo
   */
  update(time) {
    // Calcula distancia al jugador
    const distanceToPlayer = Phaser.Math.Distance.Between(
        this.x, this.y, 
        this.scene.player.x, this.scene.player.y
      );
      
      // Si el jugador está dentro del rango de detección (580px), lo persigue
      if (distanceToPlayer < 780) {
        this.moveC()
        this.flipSkull()
      } else {
        // Reproduce animación de reposo
        this.play('skullFly');
      }
      
      // AÑADIR ESTO: Movimiento cíclico en Y (flotación)
      // Necesitas this.startY definido en constructor
      // y this.floatTime acumulando
     

    
  }
  paralyzePlayer(player) {
    if (!this.isActive || !this.alive) return false;
    
    // Verificar si el jugador ya está paralizado
    if (player.isParalyzed) {
        return player.damg(0.5); // Solo daño adicional
    }
    
    // Efecto de paralización
    player.isParalyzed = true;
    player.setTint(0x0000ff); // Color azul para indicar paralizado
    
    // Congelar controles del jugador
    player.body.setVelocityY(0)
    player.body.setVelocity(0, player.body.velocity.y);
    
    // Restaurar después de 3 segundos
    this.scene.time.delayedCall(3000, () => {
        if (player && player.active) {
            player.isParalyzed = false;
            player.setTint(0xffffff);
            
            // Restaurar velocidad horizontal si el jugador presiona teclas
            if (player.scene.cursors.left.isDown) {
                player.body.setVelocityX(-player.scene.speedX);
            } else if (player.scene.cursors.right.isDown) {
                player.body.setVelocityX(player.scene.speedX);
            }
        }
    });
    
    // Quitar medio corazón
    return player.damg(0.5);
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
      this.paralyzePlayer()
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

export default SkullFire;