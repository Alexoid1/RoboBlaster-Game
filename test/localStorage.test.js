import LocalStorage from '../src/Tools/localStorage';

it('Save data to localStorage', () => {
  LocalStorage.saveScore('Alexoid');
  expect(JSON.parse(localStorage.getItem('score'))).toBe('Alexoid');
});

it('Get data from localStorage', () => {
  localStorage.setItem('score', JSON.stringify('Alexoid'));
  expect(JSON.parse(localStorage.getItem('score'))).toBe('Alexoid');
});

it('Read data from localStorage', () => {
  localStorage.setItem('score', JSON.stringify('Alexoid'));
  expect(LocalStorage.getScore()).toBe('Alexoid');
});

it('Clears all data from localStorage', () => {
  localStorage.setItem('score', JSON.stringify('Alexoid'));
  LocalStorage.clearStorage();
  expect(JSON.parse(localStorage.getItem('score'))).toBe(null);
});
