import Phaser from 'phaser';
import Button from '../Js/Button';
import titleBg from '../assets/robotfon.png';
/* eslint-disable no-undef */
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  preload() {
    this.load.image('bg', titleBg);
  }

  create() {
    const height = this.scale.height * 0.5;
    const width = this.scale.width * 0.5;
    this.add.image(width, height, 'bg').setScale(1.4, 1.4);

    this.startButton = new Button(
      this,
      width,
      height - 150,
      'button',
      'button2',
      'Start',
      'Game',
    );

    this.optionsButton = new Button(
      this,
      width,
      height - 50,
      'button',
      'button2',
      'Options',
      'Options',
    );

    this.creditsButton = new Button(
      this,
      width,
      height + 50,
      'button',
      'button2',
      'Credits',
      'Credits',
    );

    this.leaderButton = new Button(
      this,
      width,
      height + 150,
      'button',
      'button2',
      'Scores',
      'LeaderBoard',
    );

//     this.model = this.sys.game.globals.model;
//     if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
//       this.bgMusic = this.sound.add('bgMusic', { volume: 0.3, loop: true });
//       this.bgMusic.play();
//       this.model.bgMusicPlaying = true;
//       this.sys.game.globals.bgMusic = this.bgMusic;
//     }
    }

  centerButton(gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(
        width,
        width - offset * 100,
        width * 2,
        height * 2,
      ),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  centerButtonText(gameText, gameButton) {
    Phaser.Display.Align.In.Center(gameText, gameButton);
  }
}