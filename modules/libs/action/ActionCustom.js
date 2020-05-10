import { Action } from './Action.js'

export class ActionCustom extends Action {

  constructor(f,params){
    super();
    this._f       = f;
    this._params  = params;
  }

  Update = (delta) => {
    this._f(this._params);
    this._isFinished = true;
  }

}
