import { Action } from './Action.js'

export const TWEEN_BEHAVIOUR = {
  ONCE   : "ONCE",
  REPEAT : "repeat",
  REPEAT_REVERSE : "repeat_reverse"
}

export class ActionTween extends Action {
  constructor(entity, property,f, start_value, end_value, duration, behaviour){
    super();

    this._entity = entity;
    this._start_value = start_value;
    this._end_value = end_value;
    this._duration = duration;
    this._change_value = end_value - start_value;
    this._start_time = 0;
    this._current_time = 0;
    this._f = f;
    this._property = property;
    this._behaviour = behaviour || TWEEN_BEHAVIOUR.ONCE;
  }

  Reset = () => {
    this._current_time = 0;
    this._start_time = 0;
  }

  Reverse = () => {
    this.Reset();
    let startValue = this._start_value;
    this._start_value = this._end_value;
    this._end_value = startValue;
    this._change_value = this._end_value - this._start_value
  }

  Update = (delta) => {

    this._entity[this._property] = this._f(this._current_time,this._start_value,this._change_value, this._duration);

    this._current_time  = Math.min(this._start_time + this._duration, this._current_time + delta)

    if((this._start_value < this._end_value && this._entity[this._property] >= this._end_value) || this._start_value > this._end_value && this._entity[this._property] <= this._end_value){

      switch(this._behaviour){
        case TWEEN_BEHAVIOUR.ONCE:
          this._isFinished = true;
          break;
        case TWEEN_BEHAVIOUR.REPEAT:
          this.Reset();
          break;
        case TWEEN_BEHAVIOUR.REPEAT_REVERSE:
          this.Reverse();
          break;
      }
    }
  }

}
