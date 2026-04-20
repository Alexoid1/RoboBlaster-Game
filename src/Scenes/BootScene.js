import Phaser from 'phaser';
import logo from '../assets/backgroun.jpg';

// eslint-disable-next-line no-undef
/**
 * Escena de arranque del juego
 * Carga recursos mínimos necesarios y pasa a la escena de precarga
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  /**
   * Precarga los recursos iniciales necesarios para mostrar la pantalla de carga
   */
  preload() {
    this.load.image('logo', logo);
  }

  /**
   * Crea la escena y pasa inmediatamente a la escena de precarga
   */
  create() {
    this.scene.start('Preloader');
  }
}