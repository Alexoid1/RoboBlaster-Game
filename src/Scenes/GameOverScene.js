import Phaser from 'phaser';
import Button from '../Js/Button';
import Dom from '../Tools/dom';
import LocalStorage from '../Tools/localStorage';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
      super('GameOver')
    }

    preload(){

    }

    create(){
        const height = this.scale.height * 0.5;
        const width = this.scale.width * 0.5;
        

       
        

        this.PlayAgainButton = new Button(
            this,
            width,
            height + 50,
            'button',
            'button2',
            'Play Again',
            'Game',
        );

        this.ExitButton = new Button(
            this,
            width,
            height + 140,
            'button',
            'button2',
            'Exit',
            'Menu',
        );
        this.title = this.add.text(width, 128, 'GAME OVER', {
            fontSize: 47,
            fontStyle: 'bold',
            color: 'white',
            align: 'center',
          });

        const score = LocalStorage.getScore();
        LocalStorage.clearStorage();

        this.score = this.add.text(400, 200, `Your score is: ${score}`, {
        font: '35px monospace',
        fill: '#888',
        align:'center'
       
        });
        this.score.setOrigin(0.5);
        this.title.setOrigin(0.5);


        Dom.nameform();
        Dom.submitButtonAction(score);
       
    }

}