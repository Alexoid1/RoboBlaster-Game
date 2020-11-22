import Phaser from 'phaser';
import moon from '../assets/moon.png';
import clouds from '../assets/clouds.png';
import forest1 from '../assets/forest1.png';
import forest2 from '../assets/forest2.png';
import forest3 from '../assets/forest3.png'
import hills from '../assets/hills.png';
import ground from '../assets/ground.png'
import platform from '../assets/platform.png';
import dude from '../assets/dude.png';
import shooter from '../assets/shooter2.png';
import shooter2 from '../assets/shooter-removebg.png';
import star from '../assets/star.png';
import bomb from '../assets/bomb.png';

const backgroundCreatorForest1=(scene,count,texture,scrollFactor) => {
    let x=0
    for(let i=0;i<count;i++){
       const m= scene.add.image(x, scene.scale.height * 0.6,texture).setScale(0.7,0.7).setScrollFactor(scrollFactor);
       x+=m.width*0.75
    }
    
}

const backgroundCreatorGround=(scene,count,texture,scrollFactor) => {
    let y=0
    for(let j=0;j<count;j++){
       const g= scene.add.image(y, scene.scale.height,texture).setOrigin(0,1).setScrollFactor(scrollFactor);
       y+=g.width*0.75
    }

}

export default class GameScene extends Phaser.Scene {
    constructor() {
      super('Game');
    }

    preload(){
        this.load.image('moon',moon);
        this.load.image('clouds',clouds);
        this.load.image('forest1',forest1);
        this.load.image('forest2',forest2);
        this.load.image('forest3',forest3);
        this.load.image('hills',hills);
        this.load.image('ground',ground);

    }
     
    create(){
        const width=this.scale.width;
        const height=this.scale.height;

        this.add.image(width * 0.5, height * 0.5, 'moon').setScale(0.6,0.6).setScrollFactor(0);
        this.add.image(0,height,'clouds').setScale(0.5,0.5).setOrigin(0,1.2).setScrollFactor(0);
        backgroundCreatorForest1(this,10,'forest1',0.25);
        backgroundCreatorForest1(this,10,'forest2',0.25);
        backgroundCreatorForest1(this,10,'forest3',0.50);
        backgroundCreatorGround(this,10,'ground',1) 
        // this.add.image(width * 0.5, height * 0.6, 'forest1').setScale(0.7,0.7).setScrollFactor(0.25);
        // this.add.image(width * 0.5, height * 0.6, 'forest2').setScale(0.7,0.7).setScrollFactor(0.25);
        // this.add.image(width * 0.5, height * 0.6, 'forest3').setScale(0.7,0.7).setScrollFactor(0.50);
        // this.add.image(0,height,'ground').setOrigin(0,1).setScrollFactor(1);
        this.cameras.main.setBounds(0,0,60000,height)
        
    }
    
    update(){
        const speed=10
       
        const cursors=this.input.keyboard.createCursorKeys()
        const cam=this.cameras.main
        if(cursors.right.isDown){
            cam.scrollX+=speed
        }
        else if(cursors.left.isDown){
            cam.scrollX-=speed
        }
    }

}    



