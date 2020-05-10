import { Action } from '../libs/action/Action.js'
import Vector2D from '../libs/vector/Vector2D.js'

const MOVE_SPEED = 0.5;

export class ActionFollowPath extends Action {


  constructor(entity,path){
    super();

    this._entity = entity;
    this._path = path;
    this._currentNode = this._path.shift();

    // No point doing the action if there is no path, so lets just finish is straight away
    if(path.length == 0){
      console.log("No path found!");
      this._isFinished = true;
    }
  }

  Update = (delta) => {

    let vectorToTarget = new Vector2D(this._currentNode.position.x - this._entity.position.x,this._currentNode.position.y - this._entity.position.y)
    let normalizedToTarget = new Vector2D(this._currentNode.position.x - this._entity.position.x,this._currentNode.position.y - this._entity.position.y).normalize();
    let movementVector = Vector2D.multiply(normalizedToTarget,delta * MOVE_SPEED)

    // If the distance from the current position to the target is less than the movement vector then we
    // might as well just put the user into the position and move onto the next node
    if (vectorToTarget.length() <= movementVector.length()){

      this._entity.position.x = this._currentNode.position.x;
      this._entity.position.y = this._currentNode.position.y;

      if(this._path.length > 0){
        this._currentNode = this._path.shift();
      } else {

        this._isFinished = true;
        return;
      }

    } else { // Otherwise, move the user towards the position

      this._entity.position.x += movementVector.x;
      this._entity.position.y += movementVector.y;
    }
  }

}
