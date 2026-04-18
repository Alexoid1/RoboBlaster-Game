/* eslint-disable no-undef */
import Phaser from 'phaser';

/**
 * Clase que representa un láser/proyectil disparado por el jugador
 * Extiende Phaser.Physics.Arcade.Sprite para tener física
 */
export default class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    
    // Habilita física y añade a la escena
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setTexture(key);
  }

  /**
   * Dispara el láser desde una posición específica
   * @param {number} x - Posición horizontal inicial
   * @param {number} y - Posición vertical inicial
   */
  fire(x, y) {
    // Posiciona y activa el láser
    this.body.reset(x, y - 30);
    this.body.setSize(170, 77);      // Tamaño del colisionador
    this.body.enable = true;         // Habilita física
    this.setActive(true);            // Activa el objeto
    this.setVisible(true);           // Hace visible
    
    // Aplica velocidad horizontal
    this.setVelocityX(900);
  }
}