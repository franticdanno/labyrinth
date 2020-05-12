// Library imports
import BaseState from './libs/state/BaseState.js'
import { SequenceAction } from './libs/action/Action.js'

export default class GameOverState extends BaseState {

  constructor(entity,winningPlayer){
    super(entity);
    this._actionManager = new SequenceAction();
    this._winningPlayer = winningPlayer;
  }

  Enter = () => {
    let message = "Game Over! " + this._winningPlayer.GetHouse() + " won!";


    this._actionManager.AddActions(this._entity.GetGeneralTitleSequence(message,0xaf2adb))
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
