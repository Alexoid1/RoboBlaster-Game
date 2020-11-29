/* eslint-disable no-undef */
import CreditsScene from '../src/Scenes/CreditsScene';

describe('It test the existing subclass', () => {
  it('has to be a subclass of Phaser.Scene', () => {
    expect(CreditsScene).toBeSubclassOf(Phaser.Scene);
  });
});