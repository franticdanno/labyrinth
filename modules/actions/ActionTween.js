import { Action } from './Action.js'

export class ActionTween extends Action {
  constructor(entity, property,f, start_value, end_value, duration){
    super();

    this._entity = entity;
    this._start_value = start_value;
    this._end_value = end_value;
    this._duration = duration;
    this._change_value = end_value - start_value;
    this._current_time = 0;
    this._f = f;
    this._property = property;
  }

  Update = (delta) => {

    this._entity[this._property] = this._f(this._current_time,this._start_value,this._change_value, this._duration);

    this._current_time  = Math.min(this._current_time + this._duration, this._current_time + delta)

    if(this._entity[this._property] >= this._end_value){
      this._isFinished = true;
    }
  }

}
