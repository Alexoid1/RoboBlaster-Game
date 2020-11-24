import Phaser from 'phaser';
import Button from '../Js/Button';
export default class GameOverScene extends Phaser.Scene {
    constructor() {
      super('GameOver');
    }

    preload(){

    }

    create(){
        const height = this.scale.height * 0.5;
        const width = this.scale.width * 0.5;

        this.title = this.add.text(width, 128, 'GAME OVER', {
            fontSize: 47,
            fontStyle: 'bold',
            color: 'white',
            align: 'center',
          });
        this.title.setOrigin(0.5);

        this.PlayAgainButton = new Button(
            this,
            width,
            height - 100,
            'button',
            'button2',
            'Play Again',
            'Game',
        );

        this.ExitButton = new Button(
            this,
            width,
            height - 20,
            'button',
            'button2',
            'Exit',
            'Menu',
        );
    }

}