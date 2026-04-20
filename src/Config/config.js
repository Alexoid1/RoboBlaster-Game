/* eslint-disable no-undef */
import 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 730,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 },

    },
  },
};

export default config;