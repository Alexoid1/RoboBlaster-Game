import Laser from './Laser';

class PlayerLaser extends Laser {
  constructor(scene,x,y,) {
    super(scene,x,y,'blast');
    
    
    this.setScale(0.5)
    this.body.setSize(240,257)
    

  }
  
  
}   

export default PlayerLaser;