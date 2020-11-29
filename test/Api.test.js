import API from '../src/Tools/api';

it('Get the scores from the localStorage', () => {
  API.ScoreList()
    .then((response) => {
      expect(response).toBe('Succeed');
    })
    .catch((error) => error);
});

it('Post a new score to localStorage', () => {
  API.submit('Alexoid2', 650)
    .then((response) => {
      expect(response).toBe('Leaderboard score created correctly.');
    })
    .catch((error) => error);
});

it('should send an object to the API', () => {
  API.submit().then(data => {
    expect(typeof data).toBe('object');
  }).catch(() => { });
});

it('If name is not provided, then it should not send anything to avoid an error', () => {
  API.submit('', 0)
    .then((response) => {
      expect(response).toBe(null);
    })
    .catch((error) => error);
});

it('Score can\'t be 0', () => {
  API.submit('Alexoid', 0)
    .then((response) => {
      expect(response).toBe(null);
    })
    .catch((error) => error);
});

it('it should return the username', () => {
  API.ScoreList().then(data => {
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user: 'Alexoid1',
        }),
      ]),
    );
  }).catch(() => { });
});

it('it should return the score', () => {
  API.ScoreList().then(data => {
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          score: '100',
        }),
      ]),
    );
  }).catch(() => { });
});