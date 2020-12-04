/* eslint-disable no-unused-expressions */
import Phaser from 'phaser';
import JumperDude from '../Js/JumperDude';
import ChaserDude from '../Js/ChaserDude';
import Player from '../Js/Player';
import LaserGroup from '../Js/LaserGroup';
import SlashGroup from '../Js/SlashGroup';
import LocalStorage from '../Tools/localStorage';


let cursors;
const speedX = 385;
let gameOver = false;
let blast;
let timer = true;
let timerSlash = true

const backgroundCreatorForest1 = (scene, count, texture, scrollFactor) => {
  let x = 0;

  for (let i = 0; i < count; i += 1) {
    const m = scene.add.image(x, scene.scale.height, texture)
      .setScale(1.3)
      .setScrollFactor(scrollFactor);
    x += m.width;
  }
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
    this.laserGroup;
    this.monsters;
    this.monster;
    this.chaser
    this.heathText;
    this.scoreText;
    this.score;
    this.model;
    this.platformNumber;
    this.particles;
    this.emitter;
    
    
  }



  create() {
    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.3, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
    this.platformNumber = 60;
    this.score = 0;
    
    let groundX = 0;
    this.createParticles=()=>{
      this.particles= this.add.particles('star');
      this.emitter=this.particles.createEmitter({
      
        x: 400,
        y: 350,
        speed: 200,
        lifespan: 500,
        blendMode: 'ADD',
        scale: { start:1, end:0 },
        on : false
      });
    }
    
    const groundY = 589;
    const platforms = this.physics.add.staticGroup();

    const backgroundCreatorGround = (count, texture) => {
      for (let j = 0; j < count; j += 1) {
        const g = platforms.create(groundX, groundY, texture).setScale(2).refreshBody();
        const { body } = g;
        body.updateFromGameObject();
        groundX += 4240;
      }
    };
    const { width } = this.scale;
    const { height } = this.scale;

    this.add.image(width * 0.5, height * 0.5, 'moon').setScale(0.6, 0.6).setScrollFactor(0);
    this.add.image(0, height, 'clouds').setScale(0.5, 0.5).setOrigin(0, 1.2).setScrollFactor(0);
    backgroundCreatorForest1(this, 20, 'forest1', 0.25);
    backgroundCreatorForest1(this, 15, 'forest2', 0.35);
    backgroundCreatorForest1(this, 10, 'forest3', 0.50);
    backgroundCreatorGround(this.platformNumber, 'ground');
    this.scoreText = this.add.text(26, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
    this.healthText = this.add.text(26, 56, 'Health: 1000', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
    this.monsters = [];
    this.createParticles()
    const monsterCreator = (num, hord) => {
      let corx = 3900;
      for (let j = 1; j < hord; j += 1) {
        for (let i = 0; i < num; i += 1) {
          if(j%7===0||j%5===0){
            if(i%2===0){
                this.monster = new ChaserDude({
                scene: this,
                x: corx + i * 15,
                y: 16,
                key: `chaser${i}${j}`,
                });
                this.physics.add.collider(this.monster, platforms);
                this.monsters.push(this.monster);
                this.monster.setBounce(2400, 0, 4900, height);
            }else{
              this.monster = new JumperDude({
                scene: this,
                x: corx + i * 15,
                y: 16,
                key: `dude${i}${j}`,
                });
                this.physics.add.collider(this.monster, platforms);
                this.monsters.push(this.monster);
                this.monster.setBounce(2400, 0, 4900, height);
    

            }

          }else{
            this.monster = new JumperDude({
            scene: this,
            x: corx + i * 15,
            y: 16,
            key: `dude${i}${j}`,
            });
            this.physics.add.collider(this.monster, platforms);
            this.monsters.push(this.monster);
            this.monster.setBounce(2400, 0, 4900, height);

          }
          
        }

        corx += 4240;
      }
    };

    monsterCreator(3, this.platformNumber);

    this.player = new Player({
      scene: this,
      x: 400,
      y: 100,
      key: 'player',
    });
    // this.chaser = new ChaserDude({
    //   scene: this,
    //   x: 3900,
    //   y: 100,
    //   key: 'chaser1',
    
    // })
    
    this.cameras.main.setBounds(0, 0, 300000, height);

    this.laserGroup = new LaserGroup(this);
    this.slashGroup = new SlashGroup(this);

    this.attackInterval = () => {
      timer = false;
      this.time.addEvent({
        delay: 20,
        repeat: 0,
        callbackScope: this,
        callback() {
          Phaser.Actions.Call(this.laserGroup.getChildren(), child => {
            child.active = false;

            this.time.addEvent({
              delay: 700,
              repeat: 0,
              callbackScope: this,
              callback() {
                timer = true;
                child.disableBody(true, true);
              },
            });
          });
        },
      });
    };
    this.slashInterval = () => {
      timerSlash = false;
      this.time.addEvent({
        delay: 50,
        repeat: 0,
        callbackScope: this,
        callback() {
          Phaser.Actions.Call(this.slashGroup.getChildren(), child => {
            child.active = false;

            this.time.addEvent({
              delay: 700,
              repeat: 0,
              callbackScope: this,
              callback() {
                timerSlash = true;
                child.disableBody(true, true);
              },
            });
          });
         
        },
      });
    };
    // this.physics.add.collider(platforms,this.chaser)

    this.physics.add.collider(platforms, this.player);

    this.physics.add.overlap(this.monsters, this.player, null, (mon2, player) => {
      player.setTint(0xff0000);

      this.healthText.setText(`Health: ${player.hp}`);
      player.damg();
      player.body.setVelocity(0, 0);
      if (player.hp <= 0) {
        gameOver = true;
      }
    }, this);

    this.physics.add.collider(platforms, blast);
    this.physics.add.overlap(this.laserGroup, this.monsters, null, (mon, laser) => {
      mon.setTint(0xff0000);
      mon.damg(50);
      this.score += 50;
      this.scoreText.setText(`Score: ${this.score}`);
      this.particles.emitParticleAt(laser.x,laser.y,50);
      laser.setVisible(false);
      laser.setActive(false);
      laser.body.enable = false;
    }, null, this);
    this.physics.add.overlap(this.slashGroup, this.monsters, null, (mon, slash) => {
      mon.setTint(0xff0000);
      mon.damg(250);
      this.score += 250;
      this.scoreText.setText(`Score: ${this.score}`);
      
      slash.setActive(false);
      slash.body.enable = false;
    }, null, this);

    this.enemies = this.add.group();
    this.cameras.main.startFollow(this.player);

    cursors = this.input.keyboard.createCursorKeys();
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);


    this.anims.create({
      key: 'groupS',
      frames: [{key: 'groupS', frame: 0 }],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'blast',
      frames: this.anims.generateFrameNumbers('blast', { start: 3, end: 5 }),
      frameRate: 7,
      repeat: -1,
    });
    
    this.anims.create({
      key: 'attackD',
      frames: this.anims.generateFrameNumbers('attackD', { start: 1, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'dash',
      frames: [{ key: 'dash', frame: 10 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers('stand', { start: 47, end: 49 }),
      frameRate: 5,
    });
    this.anims.create({
      key: 'slash',
      frames: this.anims.generateFrameNames('slash', { frames: [1, 2, 3, 4, 5, 6, 7, 8] }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNames('walk', { frames: [6, 7, 8, 9, 6, 5, 4, 3] }),
      frameRate: 10,
      yoyo: true,
      repeat: -1,
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('jump', { start: 39, end: 42 }),
      frameRate: 5,
    });
    this.anims.create({
      key: 'look',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 10,
    });
    this.anims.create({
      key: 'dudeleft',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    
  }

  update() {
    const onGround = this.player.body.touching.down || this.player.body.blocked.down;
    this.player.update();
    // this.chaser.update();

    this.monsters.forEach(monster => {
      monster.update();
    });

    if (gameOver) {
      this.physics.pause();
      LocalStorage.saveScore(this.score);
      this.scene.stop('Game');

      this.scene.start('GameOver');

      gameOver = false;
    }
    if (cursors.left.isDown && onGround) {
      this.player.setVelocityX(-460);

      this.player.flipX = true;
      this.player.setTint(0xFFFFFF);

      this.player.anims.play('right', true);
    } else if (cursors.right.isDown && onGround) {
      this.player.setVelocityX(460);
      this.player.setTint(0xFFFFFF);
      this.player.flipX = false;
      this.player.anims.play('right', true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(speedX);

      this.player.flipX = false;
      this.player.anims.play('jump', true);
    } else if (cursors.left.isDown) {
      this.player.setVelocityX(-speedX);

      this.player.flipX = true;
      this.player.anims.play('jump', true);
    } else if (cursors.down.isDown) {
      this.player.setVelocityY(550);
    } else if (cursors.down.isDown && onGround) {
      this.player.anims.play('down', true);
    } else if (this.keyW.isDown && this.player.flipX === true) {
      if(timerSlash){
        
        this.slashGroup.bladeSlash(this.player.x-70, this.player.y);
        this.player.flipX = true;
        this.player.setVelocityX(0);
        this.player.anims.play('slash', true);

        this.slashInterval();
      }
      
    } else if (this.keyW.isDown && this.player.flipX === !true) {
      if(timerSlash){
        // this.player.anims.stop('right');
        this.slashGroup.bladeSlash(this.player.x, this.player.y);
        this.player.setVelocityX(0);
        this.player.anims.play('slash', true);

        this.slashInterval();
      }
      
      
    
    } else if (this.keyE.isDown && this.player.flipX === true) {
      if (timer) {
        this.laserGroup.fireLaser(this.player.x, this.player.y);
        this.laserGroup.setVelocityX(-900);
        this.player.anims.play('attackD');

        this.attackInterval();
      }
    } else if (this.keyE.isDown && this.player.flipX !== true) {
      if (timer) {
        this.player.anims.play('attackD');
        this.laserGroup.fireLaser(this.player.x, this.player.y);

        this.attackInterval();
      }
    } else if (onGround) {
      this.player.setVelocityX(0);

      this.player.anims.play('turn', true);
    } else if (!onGround) {
      this.player.setVelocityX(0);

      this.player.anims.play('jump', true);
    }

    if (cursors.up.isDown && onGround) {
      this.player.setVelocityY(-470);
    }

    if (this.keyQ.isDown && this.player.flipX === true) {
      this.player.anims.stop('right');
      this.player.anims.play('dash', true);
      this.player.setVelocityX(-670 * 3);
    }
    if (this.keyQ.isDown && this.player.flipX === false) {
      this.player.anims.stop('right');
      this.player.anims.play('dash', true);
      this.player.setVelocityX(670 * 3);
    }

    if (this.player.y > this.scale.height) {
      this.physics.pause();
      this.player.setTint(0xff0000);
      LocalStorage.saveScore(this.score);
      this.scene.stop('Game');
      this.scene.start('GameOver');
    }
  }
}
