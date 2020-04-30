import { Action } from './Action.js'
import { DIRECTION } from '../Constants.js'

export class ActionMoveTiles extends Action {

  constructor(cellSprites,direction){
    super();
    this._speed = 114 / 30;
    this._cellSprites = cellSprites;
    this._direction = direction;
    this._totalDistanceMoved = 0;
  }

  Update = (delta) => {

    console.log("moving sprites",this._direction)

    let distance = this._speed * delta
    this._totalDistanceMoved += distance
    if(this._totalDistanceMoved > 114){
      distance -= this._totalDistanceMoved - 114
      this._isFinished = true;
    }

    this._cellSprites.forEach((cell, i) => {

      switch(this._direction)
      {
        case DIRECTION.NORTH:
          cell.y -= distance
          break;
        case DIRECTION.EAST:
          cell.x += distance
          break;
        case DIRECTION.SOUTH:
          cell.y += distance
          break;
        case DIRECTION.WEST:
          cell.x -= distance
          break;
      }

    });

  }
}
