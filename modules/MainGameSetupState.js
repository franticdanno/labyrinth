// Library imports
import BaseState from './libs/state/BaseState.js'
import { SequenceAction } from './libs/action/Action.js'
import { ActionTween } from './libs/action/ActionTween.js'
import { Tween } from './libs/tween/Tween.js'

// Custom file imports
import { ActionShowText } from './custom_actions/ActionShowText.js'
import { ActionChangeState } from './custom_actions/ActionChangeState.js'
import CellMoveState from './CellMoveState.js'

export default class MainGameSetupState extends BaseState {

  constructor(entity){
    super(entity);
  }

  Enter = () => {
    this._entity.alpha = 0;

    this._entity.SetUpBoardgame();

    // Set players up, deal out the cards etc
    this._entity.SetUpPlayers();
    this._entity.SetUpAndShuffleCards();
    this._entity.DealCards();
    this._entity.ShowPlayerCards();

    this._entity.SetCurrentPlayer(1);

    this._entity._boardgame.AddPlayersToBoard(this._entity._players)
    this._actionManager = new SequenceAction()
    this._actionManager.AddAction(new ActionTween(this._entity,"alpha",Tween.linear,0,1,1000))
      .AddAction(new ActionShowText(this._entity,"Let's Go!",1))
      .AddAction(new ActionChangeState(this._entity,new CellMoveState(this._entity)))

    //console.log("Boardgame has been set up!",this)
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
