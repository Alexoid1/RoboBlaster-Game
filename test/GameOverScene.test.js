import Phaser from 'phaser';
import GameOverScene from '../src/Scenes/GameOverScene';

describe('It test the existing subclass', () => {
  it('has to be a subclass of Phaser.Scene', () => {
    expect(GameOverScene).toBeSubclassOf(Phaser.Scene);
  });
});