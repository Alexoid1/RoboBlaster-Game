import Phaser from 'phaser';
import logo from '../assets/backgroun.jpg'


// eslint-disable-next-line no-undef
export default class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    

    preload(){
        this.load.image('logo',logo);
    }

    create() {
        this.scene.start('Preloader');
    }
}