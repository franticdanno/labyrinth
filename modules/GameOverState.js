import { ActionShowText } from './actions/ActionShowText.js'
import { Action, ParallelAction,SequenceAction } from './actions/Action.js'
import BaseState from './BaseState.js'

export default class GameOverState extends BaseState {

  constructor(entity,winningPlayer){
    super(entity);
    this._actionManager = new SequenceAction();
    this._winningPlayer = winningPlayer;
  }

  Enter = () => {
    let message = "Game Over! " + this._winningPlayer.GetHouse() + " won!";
    this._actionManager.AddAction(new ActionShowText(this._entity.GetBoardgame(),message,300))
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
