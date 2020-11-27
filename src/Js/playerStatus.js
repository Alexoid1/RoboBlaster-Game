import Phaser from 'phaser';

export default class GameUI extends Phaser.Scene{
    constructor(){
        super({
            key:'gameUI'
        })
    }

    create(){
        const lifes=this.add.group({
            classType:Phaser.GameObjects.Image
        });

        lifes.createMultiple({
            key:'playerIcon',
            
            setXY:{
                x:26,
                y:26,
                stepX:10
            },
            quantity:5
        })
    }
}
