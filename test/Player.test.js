import Player from '../src/Js/Player';
import Entity from '../src/Js/Entity';

test('Player is a subclass of Entity', () => {
  expect(Player).toBeSubclassOf(Entity);
});
