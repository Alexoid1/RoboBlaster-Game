import 'phaser';
import Entity from '../src/Js/Entity';

test('Entity is a subclass of Phaser.Scene', () => {
  expect(Entity).toBeSubclassOf(Phaser.Physics.Arcade.Sprite);
});