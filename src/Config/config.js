import 'phaser';
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
        
    },
   
};

export default config;