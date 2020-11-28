import 'phaser';
import LaserGroup from '../src/Js/LaserGroup';

test('LaserGroup is a subclass of Phaser.Scene', () => {
  expect(LaserGroup).toBeSubclassOf(Phaser.Physics.Arcade.Group);
});