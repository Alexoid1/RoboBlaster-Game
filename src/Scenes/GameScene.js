import Phaser from 'phaser';

import platform from '../assets/platform.png';
import dude from '../assets/dude.png';




let player;
let cursors;
let speedX =385;
let keyQ;


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
               y+=g.width
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
        backgroundCreatorGround(this,3,'ground',1.5);
        this.cameras.main.setBounds(0,0,60000,height);
        

        player = this.physics.add.sprite(150, 300, 'stand').setScale(0.5)
        player.setBounce(0,0,60000,height);
        // this.physics.add.sprite(240, 320, 'star');
        this.cameras.main.startFollow(player);

        this.physics.add.collider(platforms, player);
        this.anims.create({
            key: 'dash',
            frames: this.anims.generateFrameNumbers('dash', { start: 0, end: 3 }),
            frameRate: 20
        });
        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('stand', { start: 0, end: 4 }),
            frameRate: 10
        });
        this.anims.create({
            key: 'slash',
            frames: this.anims.generateFrameNames('slash', {frames:[1,2,3,4,5,6,7,8]}),
            frameRate: 10
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNames('walk', {frames:[3,4,5,6,7,8]}),
            frameRate: 10,
            yoyo:true,
            repeat: -1
        });
    
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('jump', {frames:[0,1,2,3,4]}),
            frameRate: 5,
           
        })          
    }
    
    update(){
        
    
    const onGround = player.body.touching.down;
    cursors = this.input.keyboard.createCursorKeys();
    this.keyQ=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyW=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    
    
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

    else if (this.keyQ.isDown &&player.flipX===false){
        
        player.anims.play('dash',true);
        player.setVelocityX(460*3);
        
    }
    else if (this.keyQ.isDown &&player.flipX===true){
        
        player.anims.play('dash',true);
        player.setVelocityX(-460*3);
        
    }
    else if (this.keyW.isDown ){
        
        player.anims.play('slash',true);
        
        
    }

    else if(onGround)
    {
        player.setVelocityX(0);

        player.anims.play('turn', true);
    }
    else if(!onGround)
    {
        player.setVelocityX(0);

        player.anims.play('jump', true);
    }

    if (cursors.up.isDown&&onGround)
    {
        
        player.setVelocityY(-470);
       
    }
        
    }
}    



