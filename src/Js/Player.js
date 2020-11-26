import Entity from './Entity';

class Player extends Entity {
  constructor(config) {
    super({
      ...config,
      texture: 'stand',
    //   maxHP: 50
    });
    this.body.setSize(160,200);
    this.setScale(0.5);
    this.setGravityY(520);
    

    }
}

export default Player;