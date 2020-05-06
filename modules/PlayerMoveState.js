import { Action, ParallelAction,SequenceAction } from './actions/Action.js'
import { ActionTween } from './actions/ActionTween.js'
import { Tween } from './libs/Tween.js'
import { ActionShowText } from './actions/ActionShowText.js'
import { ActionSleep } from './actions/ActionSleep.js'
import { ActionCustom } from './actions/ActionCustom.js'
import { ActionFollowPath } from './actions/ActionFollowPath.js'
import BaseState from './BaseState.js'
import BoardGame from './Boardgame.js';
import { HOUSE, CHARACTER, CELL_TYPE } from './Constants.js'
import Card from './Card.js';
import CellMoveState from './CellMoveState.js';
import GameOverState from './GameOverState.js'

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

    const failMessages = [
      "No path found! Try again...",
      "Hmmmm. I don't see a way...",
      "Yeh, that's not gonna work...",
    ]

    let board = this._entity.GetBoardgame().GetBoardCells();

    //console.log("Setting up for Cell Interaction");

    board.forEach((cell_row, i) => {
      return cell_row.forEach((cell, i) => {

        cell.interactive = true;
        cell.buttonMode = true;

        cell.on('pointerdown',(e,b)=>{

          // Check to see if the player can reach the chosen square
          let targetCell = e.target;
          let player = this._entity.GetCurrentPlayer();
          let playerCell = player.GetCurrentCell();

          let path = this._entity.GetBoardgame().GetPathFrom(player.GetCurrentCell(),targetCell);
          if(path != null && path.length != 0){

            this.RemoveListenersForCellInteraction(); // If we found a path, then lets remove the listeners
            this.MovePlayer(player, targetCell,path); // And move the player along the path

          } else {
            console.log("Unable to find path for player")
            this._actionManager.AddAction(new ActionShowText(this._entity.GetBoardgame(),failMessages[Math.floor(Math.random() * failMessages.length)],70))
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
      let actionManager = this._actionManager;

      //console.log("Here is the path:",path)
      player.SetCurrentCell(targetCell); // Set the player's current cell to ther target one
      actionManager.AddAction(new ActionFollowPath(this._entity.GetBoardgame().GetplayerContainer(),path))
        .AddAction(new ActionCustom(()=> {

          console.log("CHECKING CELL --------------")
          let player = game.GetCurrentPlayer();
          let playerCell = player.GetCurrentCell();
          let cardRequired = player.GetCardTarget();

          //console.log("Player Cell", playerCell.GetSymbol(), "Card Required", cardRequired.GetSymbol())
          if(cardRequired != null && cardRequired.GetSymbol() == playerCell.GetSymbol()){ // If the user needs a card and the cell they landed on is the same symbol...

            console.log("Found a match")
            playerCell.HideSymbol();

            actionManager.AddAction(
              new ParallelAction([
                new ActionTween(cardRequired,"width",Tween.linear,cardRequired.width * 2,800,10),
                new ActionTween(cardRequired,"height",Tween.linear,cardRequired.height * 2,600,10),
                new ActionTween(cardRequired,"alpha",Tween.linear,1,0,10)
              ])
            )
            .AddAction(new ActionShowText(state._entity.GetBoardgame(),player.GetCardTarget() != null ? "Match Found!" : "Match Found! Run home!",70))
              .AddAction(new ActionCustom(()=>{
                game.SetPlayerFoundCard(player,cardRequired);
                state.PlayerMoveFinished();

              }))
          } else if(cardRequired == null && playerCell.GetSymbol() == player.GetHouse()){ // If the user needs no card and they have landed on the home cell...
            actionManager.AddAction(new ActionCustom(()=>{
                game.ChangeState(new GameOverState(this._entity,player));
              }))
          } else {
            actionManager.AddAction(new ActionCustom(()=>{
              state.PlayerMoveFinished();
            }))
          }

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
