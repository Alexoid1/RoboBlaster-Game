import * as Phaser from 'phaser';
import Dom from '../Tools/dom';

/**
 * Clase para crear botones interactivos en el juego
 * Extiende Phaser.GameObjects.Container para agrupar sprite y texto
 */
export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key1, key2, text, targetScene) {
    super(scene);
    this.scene = scene;
    this.x = x;
    this.y = y;

    // Crea el sprite del botón con interactividad
    this.button = this.scene.add.sprite(0, 0, key1).setInteractive().setScale(1.2, 1);
    
    // Crea el texto del botón
    this.text = this.scene.add.text(0, 0, text, {
      fontSize: '32px',
      fill: '#fff',
    });

    // Centra el texto sobre el botón
    Phaser.Display.Align.In.Center(this.text, this.button);

    // Añade elementos al contenedor
    this.add(this.button);
    this.add(this.text);

    // Evento: clic del botón
    this.button.on('pointerdown', () => {
      // Oculta formularios DOM si existen
      const form = document.querySelectorAll('.form');
      if (form) {
        form.forEach(child => { child.style.display = 'none'; });
      }

      // Cambia a la escena objetivo
      this.scene.scene.start(targetScene);
      
      // Limpia elementos DOM
      Dom.removeDomElements();
    });

    // Evento: mouse sobre el botón (hover)
    this.button.on('pointerover', () => {
      this.button.setTexture(key2);  // Cambia a textura de hover
    });

    // Evento: mouse fuera del botón
    this.button.on('pointerout', () => {
      this.button.setTexture(key1);  // Restaura textura normal
    });

    // Añade el contenedor a la escena
    this.scene.add.existing(this);
  }
}