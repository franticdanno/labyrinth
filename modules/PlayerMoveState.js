import { Action, ParallelAction,SequenceAction } from './actions/Action.js'
import { ActionShowText } from './actions/ActionShowText.js'
import { ActionSleep } from './actions/ActionSleep.js'
import { ActionCustom } from './actions/ActionCustom.js'
import { ActionFollowPath } from './actions/ActionFollowPath.js'
import BaseState from './BaseState.js'
import BoardGame from './Boardgame.js';
import { HOUSE, CHARACTER, CELL_TYPE } from './Constants.js'
import Card from './Card.js';

export default class PlayerMoveState extends BaseState {

  constructor(entity){
    super(entity);
  }

  Enter = () => {

    this._actionManager = new SequenceAction()
    this._actionManager.AddAction(new ActionShowText(this._entity,"Player Turn: " + this._entity.GetCurrentPlayer().GetHouse(),1))
      .AddAction(new ActionCustom((params)=>{
        params.entity.GetBoardgame().HighlightCurrentPlayer();
      },{entity:this._entity}))
      .AddAction(new ActionCustom((params) => {
        params.entity.ListenForCellInteraction();
      },{entity:this}))

    console.log("Boardgame has been set up!",this)
  }

  Update = (delta) => {
    //console.log("Main Game State");
    if(this._actionManager != null) this._actionManager.Update(delta);
  }

  Exit = () => {

  }

  ListenForCellInteraction = () => {

    let board = this._entity.GetBoardgame().GetBoardCells();

    console.log("Setting up for Cell Interaction");

    board.forEach((cell_row, i) => {
      return cell_row.forEach((cell, i) => {

        cell.interactive = true;
        cell.buttonMode = true;

        cell.once('pointerdown',(e,b)=>{

          // Check to see if the player can reach the chosen square
          let targetCell = e.target;
          let player = this._entity.GetCurrentPlayer();
          let playerCell = player.GetCurrentCell();

          let path = this._entity.GetBoardgame().GetPathFrom(player.GetCurrentCell(),targetCell);
          if(path != null){

            this.RemoveListenersForCellInteraction(); // If we found a path, then lets remove the listeners
            this.MovePlayer(player, targetCell,path); // And move the player along the path

          } else {
            console.log("Unable to find path for player")
          }

        })
      });
    });
  }

  RemoveListenersForCellInteraction = () => {
    let board = this._entity.GetBoardgame().GetBoardCells();
    console.log("Removing listeners",board);
    board.forEach((cell_row, i) => {
      return cell_row.forEach((cell, i) => {
        //console.log("Checking",cell.symbol,symbol)
        cell.interactive = false;
        cell.buttonMode = false;
        cell.removeListener('pointerdown')
      });
    });
  }

  MovePlayer = (player,targetCell,path) => {
      console.log("Here is the path:",path)
      this._actionManager.AddAction(new ActionFollowPath(this._entity.GetBoardgame().GetPlayerSprite(),path))
  }

  GetStateName(){
    return "Main Game State";
  }
}
