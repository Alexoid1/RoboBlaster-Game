/* eslint-disable no-underscore-dangle */
/**
 * Clase para manejar la configuración de sonido del juego
 * Usa getters y setters para controlar el estado del audio
 */
export default class Sound {
  constructor() {
    // Valores iniciales de configuración de sonido
    this._soundOn = true;          // Efectos de sonido activados
    this._musicOn = true;          // Música de fondo activada
    this._bgMusicPlaying = false;  // Indica si la música está reproduciéndose
  }

  // Getter y setter para música
  set musicOn(value) {
    this._musicOn = value;
  }

  get musicOn() {
    return this._musicOn;
  }

  // Getter y setter para efectos de sonido
  set soundOn(value) {
    this._soundOn = value;
  }

  get soundOn() {
    return this._soundOn;
  }

  // Getter y setter para estado de reproducción de música
  set bgMusicPlaying(value) {
    this._bgMusicPlaying = value;
  }

  get bgMusicPlaying() {
    return this._bgMusicPlaying;
  }
}