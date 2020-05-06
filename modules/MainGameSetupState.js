import { Action, ParallelAction,SequenceAction } from './actions/Action.js'
import { ActionShowText } from './actions/ActionShowText.js'
import { ActionTween } from './actions/ActionTween.js'
import {Tween} from './libs/Tween.js'
import { ActionSleep } from './actions/ActionSleep.js'
import { ActionChangeState } from './actions/ActionChangeState.js'
import BaseState from './BaseState.js'
import BoardGame from './Boardgame.js';
import CellMoveState from './CellMoveState.js'
import { PLAYERS, CHARACTER, CELL_TYPE } from './Constants.js'
import Card from './Card.js';

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
    this._actionManager.AddAction(new ActionTween(this._entity,"alpha",Tween.linear,0,1,20))
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
