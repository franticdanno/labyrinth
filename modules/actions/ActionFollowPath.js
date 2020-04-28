import { Action } from './Action.js'
import Vector2D from './../Vector2D.js'

export class ActionFollowPath extends Action {


  constructor(entity,path){
    super();

    console.log("HERE WE GO IN MOVING",entity,path)

    this._entity = entity;
    this._path = path;
    this._currentNode = this._path.shift();
  }

  Update = (delta) => {

    let distance = new Vector2D(this._currentNode.position.x - this._entity.position.x,
        this._currentNode.position.y - this._entity.position.y)

    //console.log("Moving Player",distance.length(),this._entity.x,this._entity.y)

    if(distance.length() <= 1){

      console.log("REACHED POSITION");
      this._entity.position.x = this._currentNode.position.x;
      this._entity.position.y = this._currentNode.position.y;

      if(this._path.length > 0){
        this._currentNode = this._path.shift();
      } else {
        this._isFinished = true;
        return;
      }

    } else {

      let move = distance.normalize();
      this._entity.position.x += move.x;
      this._entity.position.y += move.y;

    }
  }

}
