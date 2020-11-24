import Phaser from 'phaser';
import JumperDude from '../Js/JumperDude'



let player;
let monster;
let mon1;
// let monsters;
let cursors;
let speedX =385;
let gameOver = false;
let score=0;




const backgroundCreatorForest1=(scene,count,texture,scrollFactor,coordY) => {
    let x=0
    
    for(let i=0;i<count;i++){
       const m= scene.add.image(x, scene.scale.height ,texture).setScale(1.3).setScrollFactor(scrollFactor);
       x+=m.width
    }
}   

const damage = (player, monster) =>{
    player.setTint(0xff0000);
    gameOver = true;
}




const enemyMoves=(mon,count)=>{
    for(let i=0;i<count;i++){
        mon.setVelocity(Phaser.Math.Between(-50, -200), 20);
    }
    count++
    
    

}

// const backgroundCreatorGround2=(scene,count,texture,scrollFactor,coordY) => {
//     let x=0
    
//     for(let i=0;i<count;i++){
//        const m= scene.add.image(x, scene.scale.height * 0.97,texture).setScale(1.6).setScrollFactor(scrollFactor);
//        x+=m.width*0.80
//     }
// }
    

export default class GameScene extends Phaser.Scene {
    constructor() {
      super('Game');
    }
    

    preload(){
        
        

    }
     
    create(){
        let groundX=0
        let groundY=589
        let platforms = this.physics.add.staticGroup();
       
        const backgroundCreatorGround=(scene,count,texture,scrollFactor) => {
            let y=0
            
            for(let j=0;j<count;j++){
               let g= platforms.create(groundX, groundY,texture).setScale(2).refreshBody();
               let body = g.body
               body.updateFromGameObject()
               y+=g.width
               groundX+=4240            
            }
        }
        const width=this.scale.width;
        const height=this.scale.height;
        const randomVelocity = (Math.random() * 100);

        this.add.image(width * 0.5, height * 0.5, 'moon').setScale(0.6,0.6).setScrollFactor(0);
        this.add.image(0,height,'clouds').setScale(0.5,0.5).setOrigin(0,1.2).setScrollFactor(0);
        backgroundCreatorForest1(this,10,'forest1',0.25);
        backgroundCreatorForest1(this,10,'forest2',0.35);
        backgroundCreatorForest1(this,10,'forest3',0.50);
       
        backgroundCreatorGround(this,4,'ground');
        this.cameras.main.setBounds(0,0,60000,height);
        

        player = this.physics.add.sprite(350, 100, 'stand').setScale(0.5);
        
        const monsters = this.physics.add.group();
        this.physics.add.collider(monsters, platforms);
        this.physics.add.collider(monsters, player, damage,null,this);
        mon1=monsters.create(700, 16, 'dude').setScale(3)

        let mon2=new JumperDude({
            scene: this,
            x: 850,
            y: 16,
            key: 'dudehump'
     
        })
        mon2.setScale(3)

        
       
        mon1.body.setGravityY(300);
        mon1.setCollideWorldBounds(true);
        
       
        // player.setBounce(0,0,60000,height);
        // this.physics.add.sprite(240, 320, 'star');
        this.cameras.main.startFollow(player);
        

        this.physics.add.collider(platforms, player);
        this.physics.add.collider(platforms,mon2);
        


        
        this.anims.create({
            key: 'dash',
            frames: this.anims.generateFrameNumbers('dash', { start: 1, end: 3 }),
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
           
        });
        
        this.anims.create({
            key: 'look',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 10,
        });
      
        this.anims.create({
            key: 'duderight',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'dudeleft',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
      

        
    }
    
    update(){
        
    
    const onGround = player.body.touching.down;
    
    cursors = this.input.keyboard.createCursorKeys();
    this.keyQ=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyW=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    
    if (gameOver) {
        this.physics.pause();
        this.scene.stop('Game');
        this.scene.start('GameOver');
        
        gameOver = false;
        score = 0;
    }
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
    else if (cursors.down.isDown){
        player.setVelocityY(550);
    }
    else if (cursors.down.isDown&&onGround){
        player.setVelocityX(0);
        player.anims.play('down', true);
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
    
    if (this.keyQ.isDown &&player.flipX===true){
        player.anims.stop('right')
        player.anims.play('dash',true);
        player.setVelocityX(-670*3);
        
    }
    if (this.keyQ.isDown &&player.flipX===false){
        player.anims.stop('right')
        player.anims.play('dash',true);
        player.setVelocityX(670*3);
        
    }

    if(player.y>this.scale.height){
        this.physics.pause();
        player.setTint(0xff0000);
        this.scene.stop('Game');
        this.scene.start('GameOver');
    }
        
    }
    
}    



