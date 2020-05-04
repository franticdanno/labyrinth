import { ActionShowText } from './actions/ActionShowText.js'
import { Action, ParallelAction,SequenceAction } from './actions/Action.js'
import BaseState from './BaseState.js'

export default class GameOverState extends BaseState {

  constructor(entity){
    super(entity);
    this._actionManager = new SequenceAction();
  }

  Enter = () => {
    this._actionManager.AddAction(new ActionShowText(this._entity.GetBoardgame(),"Game Over!",70))
  }

  Update = (delta) => {
    //console.log("Main Game State");
    if(this._actionManager != null) this._actionManager.Update(delta);
  }

  Exit = () => {

  }

  GetStateName(){
    return "Main Game State";
  }
}
