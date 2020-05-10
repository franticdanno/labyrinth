import { Action } from './Action.js'
import {TWEEN_BEHAVIOUR} from '../tween/TweenConstants.js'


export class ActionTweenCustom extends Action {
  constructor(entity, custom_function, f, start_value, end_value, duration, behaviour){
    super();

    this._entity = entity;
    this._start_value = start_value;
    this._end_value = end_value;
    this._duration = duration;
    this._change_value = end_value - start_value;
    this._start_time = 0;
    this._current_time = 0;
    this._f = f;
    this._custom_function = custom_function;
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

     // Run the custom function passing in the
    this._custom_function(this._entity,this._f(this._current_time,this._start_value,this._change_value, this._duration))

    this._current_time  = Math.min(this._start_time + this._duration, this._current_time + delta)

    if(this._current_time >= this._start_time + this._duration){

      this._custom_function(this._entity,this._end_value)

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
