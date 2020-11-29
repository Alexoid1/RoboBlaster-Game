/* eslint-disable no-undef */
import Phaser from 'phaser';
import MenuScene from '../src/Scenes/MenuScene';

describe('It test the existing subclass', () => {
  it('has to be a subclass of Phaser.Scene', () => {
    expect(MenuScene).toBeSubclassOf(Phaser.Scene);
  });
});