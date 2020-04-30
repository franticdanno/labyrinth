import { Action } from './Action.js'
import Vector2D from './../Vector2D.js'

const MOVE_SPEED = 10;

export class ActionFollowPath extends Action {


  constructor(entity,path){
    super();

    this._entity = entity;
    this._path = path;
    this._currentNode = this._path.shift();
  }

  Update = (delta) => {

    if(this._path.length == 0){
      this._isFinished = true;
      return;
    }

    let vectorToTarget = new Vector2D(this._currentNode.position.x - this._entity.position.x,this._currentNode.position.y - this._entity.position.y)
    let normalizedToTarget = new Vector2D(this._currentNode.position.x - this._entity.position.x,this._currentNode.position.y - this._entity.position.y).normalize();
    let movementVector = Vector2D.multiply(normalizedToTarget,MOVE_SPEED)

    // If the distance from the current position to the target is less than the movement vector then we
    // might as well just put the user into the position and move onto the next node
    if (vectorToTarget.length() <= movementVector.length()){

      console.log("REACHED POSITION",vectorToTarget,movementVector);
      this._entity.position.x = this._currentNode.position.x;
      this._entity.position.y = this._currentNode.position.y;

      if(this._path.length > 0){
        this._currentNode = this._path.shift();
      } else {
        this._isFinished = true;
        return;
      }

    } else { // Otherwise, move the user towards the position

      //console.log("Moving",movementVector.x,movementVector.y)
      this._entity.position.x += movementVector.x * delta;
      this._entity.position.y += movementVector.y * delta;
    }
  }

}
