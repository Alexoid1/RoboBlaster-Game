import Entity from './Entity';

/**
 * Enemigo FireSkull que flota y paraliza al jugador
 */
export default class FireSkullEnemy extends Entity {
    constructor(config) {
        // Llamar al constructor padre con configuración extendida
        super({
            ...config,
            texture: 'fireSkull',
            key: config.key || 'fireSkull'
        });
        
        // Configuración visual
        this.setFrame('sprite1');
        this.play('skullFly');
        this.setScale(1.5);
        this.setDepth(5);
        
        // Configurar cuerpo de colisión
        this.body.setSize(60, 70); // Ajustar tamaño de colisión
        this.body.setOffset(20, 20);
        
        // Estadísticas del enemigo (similar a otros enemigos)
        this.hp = 1000;          // Puntos de vida
        this.alive = true;       // Estado de vida
        this.damage = 50;        // Daño que inflige al jugador
        this.touch = false;      // Indica si está siendo dañado
        
        // Configurar movimiento de flotación
        this.floatSpeed = 50; // px/seg
        this.floatHeight = 100; // px
        this.startY = config.y;
        this.floatDirection = 1; // 1 para arriba, -1 para abajo
        
        // Estado adicional
        this.isActive = true;
    }
    
    /**
     * Aplica daño al enemigo (medio corazón por defecto)
     * @param {number} damageType - 0.5 para medio corazón, 1 para corazón completo
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
        // Efecto visual de muerte
        this.setTint('#000');
        this.alive = false;
        this.isActive = false;
        
        // Desactivar física
        if (this.body) {
            this.body.enable = false;
        }
        
        // Desaparecer después de un tiempo
        this.scene.time.delayedCall(500, () => {
            this.setActive(false);
            this.setVisible(false);
        });
    }
    
    /**
     * Actualiza el movimiento de flotación
     * @param {number} time - Tiempo actual
     * @param {number} delta - Delta time desde el último frame
     */
    update(time, delta) {
        if (!this.isActive) return;
        
        // Movimiento de flotación
        const deltaY = (this.floatSpeed * delta / 1000) * this.floatDirection;
        this.y += deltaY;
        
        // Cambiar dirección si alcanza límites
        if (this.y <= this.startY - this.floatHeight) {
            this.floatDirection = 1; // Cambiar a bajar
        } else if (this.y >= this.startY + this.floatHeight) {
            this.floatDirection = -1; // Cambiar a subir
        }
    }
    
    /**
     * Aplica efecto de paralización al jugador
     * @param {Player} player - Jugador a paralizar
     * @returns {boolean} - True si el jugador murió
     */
    paralyzePlayer(player) {
        if (!this.isActive) return false;
        
        // Verificar si el jugador ya está paralizado
        if (player.isParalyzed) {
            return player.damg(0.5); // Solo daño adicional
        }
        
        // Efecto de paralización
        player.isParalyzed = true;
        player.setTint(0x0000ff); // Color azul para indicar paralizado
        
        // Congelar controles del jugador
        const originalSpeedX = player.body.velocity.x;
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
     * Desactiva el enemigo
     */
    disable() {
        this.isActive = false;
        this.setActive(false);
        this.setVisible(false);
        if (this.body) {
            this.body.enable = false;
        }
    }
}