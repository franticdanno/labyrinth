import { Action } from './Action.js'

export class ActionChangeState extends Action {

  constructor(entity,new_state){
    super();
    this._entity = entity;
    this._new_state = new_state;
  }

  Update = (delta) => {
    this._entity.ChangeState(this._new_state);
    this._isFinished = true;
  }

}
