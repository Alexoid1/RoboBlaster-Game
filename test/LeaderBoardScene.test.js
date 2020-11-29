/* eslint-disable no-undef */
import Phaser from 'phaser';
import LeaderBoardScene from '../src/Scenes/LeaderBoardScene';

describe('It test the existing subclass', () => {
  it('has to be a subclass of Phaser.Scene', () => {
    expect(LeaderBoardScene).toBeSubclassOf(Phaser.Scene);
  });
});