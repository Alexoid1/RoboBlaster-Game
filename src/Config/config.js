import 'phaser';
import GameUI from '../Js/playerStatus'
import GameScene from '../Scenes/GameScene';
import MenuScene from '../Scenes/MenuScene';
import BootScene from '../Scenes/BootScene';
import PreloaderScene from '../Scenes/PreloaderScene';
import GameOverScene from '../Scenes/GameOverScene';
var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 630,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 },
            
        },
        scene:[GameUI]
        
    },
   
};

export default config;