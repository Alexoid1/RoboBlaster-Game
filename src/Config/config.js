/* eslint-disable no-undef */
import * as Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 730,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 },

    },
  },
};

export default config;