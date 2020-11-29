/* eslint-disable no-undef */
import 'phaser';
import Laser from '../src/Js/Laser';

test('Laser is a subclass of Phaser.Scene', () => {
  expect(Laser).toBeSubclassOf(Phaser.Physics.Arcade.Sprite);
});