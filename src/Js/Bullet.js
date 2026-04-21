import * as Phaser from 'phaser';

/**
 * Clase que representa una bala/proyectil
 * Extiende Phaser.Physics.Arcade.Sprite para tener física
 */
class Bullet extends Phaser.Physics.Arcade.Sprite {
    flame;
    constructor(scene, x, y) {
        super(scene, x, y, "bullet");
        
        // Habilita física y añade a la escena
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.setTexture("bullet");
        
        this.speed = Phaser.Math.GetSpeed(450, 1);
        this.name = "bullet";
        
    }

    /**
     * Dispara la bala desde una posición específica
     * @param {number} x - Posición horizontal inicial
     * @param {number} y - Posición vertical inicial
     */
    fire(x, y) {
        // Posiciona y activa la bala
        this.body.reset(x, y);
        this.body.enable = true;         // Habilita física
        this.setActive(true);            // Activa el objeto
        this.setVisible(true);           // Hace visible
        
        // Aplica velocidad horizontal
        this.setVelocityX(900);
        
        // Permitir colisiones inicialmente
        this.body.checkCollision.none = false;
    }

    /**
     * Destruye la bala con efectos de partículas
     */
    destroyBullet(bulletInEnemy) {
        // Desactiva colisiones para evitar más overlaps
        if (this.body) {
            this.body.checkCollision.none = true;
            this.body.enable = false;
            if(bulletInEnemy){
            this.flame = this.scene.add.particles(this.x, this.y, 'flares',
                {
                    frame: 'white',
                    color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
                    colorEase: 'quad.out',
                    lifespan: 500,
                    scale: { start: 0.70, end: 0, ease: 'sine.out' },
                    speed: 200,
                    advance: 500,
                    frequency: 50,
                    blendMode: 'ADD',
                    duration: 1000,
                });
                this.flame.setDepth(1);
            // When particles are complete, destroy them
            this.flame.once("complete", () => {
                this.flame.destroy();
            })
        }
        }
       
        
        // Desactiva la bala
        this.setActive(false);
        this.setVisible(false);
        this.setVelocityX(0);
        
        // Si existe el grupo, devuelve la bala al pool
        if (this.scene && this.scene.bullets) {
            this.scene.bullets.killAndHide(this);
        }
    }

    /**
     * Actualiza la posición de la bala y la destruye si sale de pantalla
     * @param {number} time - Tiempo actual
     * @param {number} delta - Delta time desde el último frame
     */
    update(time, delta) {
        // Si la bala sale de los límites de la pantalla, la destruye
        if (this.x > this.scene.player.x + 700 || this.x < this.scene.player.x - 700) {
            this.destroyBullet(false);
        }
    }
}

export default Bullet;
