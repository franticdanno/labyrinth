import { Action } from './Action.js'

export class ActionSleep extends Action {

  constructor(time){
    super();
    this._time = time;
  }

  Update = (delta) => {
    this._time -= delta;
    console.log("Update timer",this._time)
    if (this._time <= 0)
    {
      this._isFinished = true;
    }
  }

}
