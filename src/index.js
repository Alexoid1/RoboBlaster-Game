import Phaser from 'phaser';
import config from './Config/config';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import MenuScene from './Scenes/MenuScene';
import LeaderBoardScene from './Scenes/LeaderBoardScene';
import CreditsScene from './Scenes/CreditsScene';
import OptionsScene from './Scenes/OptionsScene';
import GameScene from './Scenes/GameScene';
import GameOverScene from './Scenes/GameOverScene';
import Sound from './Js/Sound';

/**
 * Clase principal del juego que extiende Phaser.Game
 * Configura todas las escenas y gestiona el estado global del juego
 */
class Game extends Phaser.Game {
  constructor() {
    super(config);
    // Inicializa el modelo de sonido y variables globales
    const model = new Sound();
    this.globals = { model, bgMusic: null };
    
    // Registra todas las escenas del juego
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Menu', MenuScene);
    this.scene.add('LeaderBoard', LeaderBoardScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Game', GameScene);
    this.scene.add('GameOver', GameOverScene);
    
    // Inicia la escena de arranque
    this.scene.start('Boot');
  }
}

// Crea una instancia global del juego
window.game = new Game();
