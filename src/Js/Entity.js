/* eslint-disable no-undef */
import * as Phaser from 'phaser';

/**
 * Clase base para todas las entidades del juego
 * Extiende Phaser.Physics.Arcade.Sprite para proporcionar funcionalidad física básica
 */
export default class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    // Habilita física para esta entidad
    config.scene.physics.world.enable(this);
    
    // Añade la entidad a la escena
    config.scene.add.existing(this);

    // Establece la textura inicial
    this.setTexture(config.texture);
  }
}
