import { Action } from './Action.js'

export class ActionGroupTween extends Action {
  constructor(entities, property,f, change, duration){
    super();

    this._entities = entities;

    // Set up the starting values as this is relative
    this._start_values = []
    this._end_values = []
    entities.forEach((entity, i) => {
      this._start_values[i] = entity[property]
      this._end_values[i] = entity[property]
    });

    this._duration = duration;
    this._change_value = change;
    this._current_time = 0;
    this._f = f;
    this._property = property;
  }

  Update = (delta) => {
    this._current_time  = Math.min(this._current_time + this._duration, this._current_time + delta)

    this._entities.forEach((entity, i) => {
      entity[this._property] = this._f(this._current_time,this._start_values[i],this._change_value, this._duration);
    });

    if(this._current_time >= this._duration){
      this._isFinished = true;
    }
  }

}
