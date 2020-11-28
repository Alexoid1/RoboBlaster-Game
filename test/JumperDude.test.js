import JumperDude from '../src/Js/JumperDude';
import Entity from '../src/Js/Entity';

test('JumperDude is a subclass of Entity', () => {
  expect(JumperDude).toBeSubclassOf(Entity);
});

