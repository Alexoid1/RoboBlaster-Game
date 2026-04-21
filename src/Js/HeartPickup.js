import * as Phaser from 'phaser';

/**
 * Clase que representa un corazón recolectable
 * Aparece cuando un enemigo muere y puede ser recogido por el jugador
 */
export default class HeartPickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'heart');
    
    // Habilita física y añade a la escena
    scene.physics.world.enable(this);
    scene.add.existing(this);
    
    // Configuración física
    this.setScale(0.5);
    this.body.setSize(32, 32);
    this.body.setOffset(0, 0);
    
    // Efecto visual flotante
    this.scene.tweens.add({
      targets: this,
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Los corazones ya NO desaparecen automáticamente
    // Solo se destruyen cuando el jugador los recoge
    console.log(`Corazón creado en posición: (${x}, ${y})`);
  }
  
  /**
   * Método llamado cuando el jugador recoge el corazón
   */
  collect() {
    // Efecto visual de recolección
    this.scene.tweens.add({
      targets: this,
      scale: 1.5,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.destroy();
      }
    });
  }
}