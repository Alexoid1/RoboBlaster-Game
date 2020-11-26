import Phaser from 'phaser';
import config from './Config/config';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import MenuScene from './Scenes/MenuScene';
import GameScene from './Scenes/GameScene';
import GameOverScene from './Scenes/GameOverScene';


class Game extends Phaser.Game {
    constructor() {
      super(config);
      this.scene.add('Boot', BootScene);
      this.scene.add('Preloader', PreloaderScene);
      this.scene.add('Menu', MenuScene);
      this.scene.add('Game', GameScene);
      this.scene.add('GameOver', GameOverScene);
      this.scene.start('Boot');
    }
    

    
}
window.game = new Game();

/*



// function init() {
//     this.score = 0;
//     this.playerSpeed = 290;
//     this.jumpSpeed = -600;
//     this.height = this.scale.height;
//     this.width = this.scale.width;
//     this.isGameOver = false;
// }
// 

function backgroundLoop(){}

function preload ()
{

	// this.load.image('sky', sky);
    this.load.image('ground', platform);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.spritesheet('dude', 
        shooter,
        { frameWidth:51.4 , frameHeight: 80,margin:1.6,
            spacing:9.7}
    );
    this.load.spritesheet('dudejump', 
        shooter,
        { frameWidth:43.4, frameHeight: 80,margin:2,
            spacing:15.2}
    );
    this.load.spritesheet('dudestand', 
        shooter,
        { frameWidth:64.4, frameHeight: 80,margin:11,
            spacing:12.2}
    );
}

var platforms;
var player;
var player2;
var cursors;
var stars;
var score = 0;
var scoreText;
var bombs;

function create ()
{
    // this.add.image(400, 300, 'sky');
    
    platforms = this.physics.add.staticGroup();

    platforms.create(100, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    player = this.physics.add.sprite(150, 300, 'dude');
    // player2 = this.physics.add.sprite(150, 300,'dudeattack');
    
    

    
    player.setCollideWorldBounds(true);
    // player2.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dudestand', frame: 0 } ],
        frameRate: 1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 11, end: 19 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('dudejump', { start: 21, end: 26 }),
        frameRate: 5,
       
    })

    this.anims.create({
        key: 'jumpsame',
        frames: [ { key: 'dudejump', frame: 22 } ],
        frameRate: 1
    });

    this.anims.create({
        key: 'down',
        frames: [ { key: 'dudestand', frame: 6 } ],
        frameRate: 1
    });
    

    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.iterate(function (child) {
    
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    
    function collectStar (player, star)
    {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0)
        {
            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }
    }
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
    function hitBomb (player, bomb){
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
    }
}

function update (){
    
    const onGround = player.body.touching.down;
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
        player.setVelocityX(360);
        player.flipX = false;
        player.anims.play('jump', true);
    }
    else if (cursors.left.isDown){
        player.setVelocityX(-360);
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



*/