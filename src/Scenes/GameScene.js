import Phaser from 'phaser';

import platform from '../assets/platform.png';
import dude from '../assets/dude.png';

import shooter2 from '../assets/shooter-removebg.png';


let player;
let cursors;
let speedX =360;

const backgroundCreatorForest1=(scene,count,texture,scrollFactor) => {
    let x=0
    
    for(let i=0;i<count;i++){
       const m= scene.add.image(x, scene.scale.height * 0.6,texture).setScale(0.7,0.7).setScrollFactor(scrollFactor);
       x+=m.width*0.75
    }
}   
    




export default class GameScene extends Phaser.Scene {
    constructor() {
      super('Game');
    }
    

    preload(){
        
        

    }
     
    create(){
        let platforms = this.physics.add.staticGroup();
       
        const backgroundCreatorGround=(scene,count,texture,scrollFactor) => {
            let y=0
            
            for(let j=0;j<count;j++){
               const g= platforms.create(y, scene.scale.height,texture).setOrigin(0,1).setScrollFactor(scrollFactor);
               y+=g.width*0.75
               const body = g.body
                body.updateFromGameObject()
            }
        
        }
        const width=this.scale.width;
        const height=this.scale.height;

        this.add.image(width * 0.5, height * 0.5, 'moon').setScale(0.6,0.6).setScrollFactor(0);
        this.add.image(0,height,'clouds').setScale(0.5,0.5).setOrigin(0,1.2).setScrollFactor(0);
        backgroundCreatorForest1(this,10,'forest1',0.25);
        backgroundCreatorForest1(this,10,'forest2',0.25);
        backgroundCreatorForest1(this,10,'forest3',0.50);
        backgroundCreatorGround(this,10,'ground',1.5);
        this.cameras.main.setBounds(0,0,60000,height);
        

        player = this.physics.add.sprite(150, 300, 'dudestand');
        player.setBounce(0,0,60000,height);
        // this.physics.add.sprite(240, 320, 'star');
        this.cameras.main.startFollow(player);

        this.physics.add.collider(platforms, player);
        this.anims.create({
            key: 'jumpsame',
            frames: [ { key: 'dudejump', frame: 22 } ],
            frameRate: 1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dudestand', frame: 0 } ],
            frameRate: 1
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('walk', { start: 11, end: 19 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('dudejump', { start: 21, end: 26 }),
            frameRate: 5,
           
        })
    
        
    
        this.anims.create({
            key: 'down',
            frames: [ { key: 'dudestand', frame: 6 } ],
            frameRate: 1
        });
        
    
        
    }
    
    update(){
        
        const speed=10
        const onGround = player.body.touching.down;
        cursors = this.input.keyboard.createCursorKeys();
        
        // const cam=this.cameras.main
    if (cursors.left.isDown&& onGround)
    {
        player.setVelocityX(-460);
        
        player.flipX = true;
        player.anims.play('right', true);
    }
    else if (cursors.right.isDown && onGround)
    {
        player.setVelocityX(460);
        player.flipX = false;
        player.anims.play('right', true);
    }
    else if (cursors.right.isDown){
        player.setVelocityX(speedX);
        player.flipX = false;
        player.anims.play('jump', true);
    }
    else if (cursors.left.isDown){
        player.setVelocityX(-speedX);
        player.flipX = true;
        player.anims.play('jump', true);
    }
    else if (cursors.down.isDown&&onGround){
        player.setVelocityX(0);
        player.anims.play('down', true);
    }

    else if (cursors.space.isDown){
        
        player.anims.play('attack',true);
    }
    else if(onGround)
    {
        player.setVelocityX(0);

        player.anims.play('turn', true);
    }
    else if(!onGround)
    {
        player.setVelocityX(0);

        player.anims.play('jumpsame', true);
    }

    if (cursors.up.isDown&&onGround)
    {
        
        player.setVelocityY(-470);
       
    }
        
    }
}    



