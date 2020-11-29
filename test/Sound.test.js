import Sound from '../src/Js/Sound';

describe('Sound', () => {
  let sound = new Sound();

  afterAll(() => {
    sound = new Sound();
  });
  it('should have a default getter soundOn set to true', () => {
    expect(sound.soundOn).toStrictEqual(true);
  });
  it('should have a default getter musicOn set to true', () => {
    expect(sound.musicOn).toStrictEqual(true);
  });
  it('should have a default getter bgMusicPlaying set to true', () => {
    expect(sound.bgMusicPlaying).toStrictEqual(false);
  });

  it('should have a default setter soundOn where we can change the value', () => {
    sound.soundOn = 'x';
    expect(sound.soundOn).toStrictEqual('x');
  });
  it('should have a default setter musicOn where we can change the value', () => {
    sound.musicOn = 'x';
    expect(sound.musicOn).toStrictEqual('x');
  });
  it('should have a default setter bgMusicPlaying where we can change the value', () => {
    sound.bgMusicPlaying = 'x';
    expect(sound.bgMusicPlaying).toStrictEqual('x');
  });
});