import Phaser from 'phaser';
import Button from '../Js/Button';
import Dom from '../Tools/dom';
import LocalStorage from '../Tools/localStorage';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    const height = this.scale.height * 0.5;
    const width = this.scale.width * 0.5;

    this.PlayAgainButton = new Button(
      this,
      width,
      height + 75,
      'button',
      'button2',
      'Play Again',
      'Game',
    );

    this.ExitButton = new Button(
      this,
      width,
      height + 170,
      'button',
      'button2',
      'Exit',
      'Menu',
    );
    this.title = this.add.text(width, 128, 'GAME OVER', {
      fontSize: 50,
      fontStyle: 'bolder',
      color: 'white',
      align: 'center',
      family: 'arial',
    });

    const score = LocalStorage.getScore();
    LocalStorage.clearStorage();

    this.score = this.add.text(width, 200, `Your score is: ${score}`, {
      font: '35px monospace',
      align: 'center',
      color: 'white',

    });
    this.score.setOrigin(0.5);
    this.title.setOrigin(0.5);

    Dom.nameform();
    Dom.submitButtonAction(score);
  }
}