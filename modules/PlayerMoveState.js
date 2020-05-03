import { Action, ParallelAction,SequenceAction } from './actions/Action.js'
import { ActionShowText } from './actions/ActionShowText.js'
import { ActionSleep } from './actions/ActionSleep.js'
import { ActionCustom } from './actions/ActionCustom.js'
import { ActionFollowPath } from './actions/ActionFollowPath.js'
import BaseState from './BaseState.js'
import BoardGame from './Boardgame.js';
import { HOUSE, CHARACTER, CELL_TYPE } from './Constants.js'
import Card from './Card.js';
import CellMoveState from './CellMoveState.js';

export default class PlayerMoveState extends BaseState {

  constructor(entity){
    super(entity);
    this._actionManager = new SequenceAction();
  }

  Enter = () => {

    let state = this;

    let playerCell = this._entity.GetCurrentPlayer().GetCurrentCell();
    let neighbours = this._entity.GetBoardgame().GetNeighbouringCells(playerCell);
    console.log("Player cell is:",playerCell, "with",neighbours.length, "neigbours");

    if(neighbours.length == 0){

      this._actionManager.AddAction(new ActionShowText(this._entity,"No Moves Possible. Skipping...",1))
        .AddAction(new ActionCustom(() => {
          state.PlayerMoveFinished();
        }))


    } else {
      this._actionManager.AddAction(new ActionShowText(this._entity,"Time to Move!",1))
        .AddAction(new ActionCustom((params)=>{
          params.entity.GetBoardgame().HighlightCurrentPlayer();
        },{entity:this._entity}))
        .AddAction(new ActionCustom((params) => {
          params.entity.ListenForCellInteraction();
        },{entity: state}))
    }
  }

  Update = (delta) => {
    //console.log("Main Game State");
    if(this._actionManager != null) this._actionManager.Update(delta);
  }

  Exit = () => {

  }

  ListenForCellInteraction = () => {

    let board = this._entity.GetBoardgame().GetBoardCells();

    //console.log("Setting up for Cell Interaction");

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

        cell.on('pointerover',(e,b) => {
            let target = e.target;
            target.alpha = 0.8;
            //console.log("pointer over")
            target.once('pointerout',(e,b) => {
              //console.log("pointer out")
              target.alpha = 1.0;
            })
        })
      });
    });
  }

  RemoveListenersForCellInteraction = () => {
    let board = this._entity.GetBoardgame().GetBoardCells();
    //console.log("Removing listeners",board);
    board.forEach((cell_row, i) => {
      cell_row.forEach((cell, i) => {
        //console.log("Checking",cell.symbol,symbol)
        cell.interactive = false;
        cell.buttonMode = false;
        cell.alpha = 1.0;
        cell.removeListener('pointerdown')
        cell.removeListener('pointerover')
        //console.log("Removing listeners")
      });
    });
  }

  MovePlayer = (player,targetCell,path) => {
      let game = this._entity
      let state = this;
      //console.log("Here is the path:",path)
      player.SetCurrentCell(targetCell); // Set the player's current cell to ther target one
      this._actionManager.AddAction(new ActionFollowPath(this._entity.GetBoardgame().GetplayerContainer(),path))
        .AddAction(new ActionCustom(()=> {

          console.log("CHECKING CELL --------------")
          let player = game.GetCurrentPlayer();
          let playerCell = player.GetCurrentCell();
          let cardRequired = player.GetCardTarget();

          console.log("Player Cell", playerCell.GetSymbol(), "Card Required", cardRequired.GetSymbol())
          if(playerCell.GetSymbol() == cardRequired.GetSymbol()){
            console.log("Found a match")
            playerCell.HideSymbol();
            game.SetPlayerFoundCard(player,cardRequired);
          } else {
            console.log("No Match")
          }

          state.PlayerMoveFinished();
          //this._isFinished = true;

        }))
  }

  PlayerMoveFinished = () => {
    this._entity.NextPlayer();
    this._entity.ChangeState(new CellMoveState(this._entity));
  }

  GetStateName(){
    return "Main Game State";
  }
}
