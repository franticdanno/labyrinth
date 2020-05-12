// Library imports
import { ParallelAction,SequenceAction } from './libs/action/Action.js'
import { ActionTween } from './libs/action/ActionTween.js'
import { Tween } from './libs/tween/Tween.js'
import { ActionCustom } from './libs/action/ActionCustom.js'
import BaseState from './libs/state/BaseState.js'

import { ActionFollowPath } from './custom_actions/ActionFollowPath.js'
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

      this._actionManager.AddActions(this._entity.GetGeneralTitleSequence("No Moves Available!",0xdb7414,'./assets/signs.png'))
        .AddAction(new ActionCustom(() => {
          state.PlayerMoveFinished();
        }))


    } else {
      this._actionManager.AddActions(this._entity.GetTimeToMoveSequence("Time to Move!",0xdbb22a))
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
    let state = this;
    //console.log("Setting up for Cell Interaction");

    board.forEach((cell_row, i) => {
      cell_row.forEach((cell, i) => {

        cell.interactive = true;
        cell.buttonMode = true;

        cell.on('pointerdown',(e,b)=>{

          // Check to see if the player can reach the chosen square
          let targetCell = e.target;
          let player = this._entity.GetCurrentPlayer();
          let playerCell = player.GetCurrentCell();

          if(targetCell == playerCell){ // If the chosen cell is the user's current cell...

            this.RemoveListenersForCellInteraction(); // If we found a path, then lets remove the listeners

            this._actionManager.AddActions(this._entity.GetGeneralTitleSequence("Bold move, not moving...",0xFF0000))
            .AddAction(new ActionCustom(()=>{
              state.PlayerMoveFinished();
            }))

          } else {

            let path = this._entity.GetBoardgame().GetPathFrom(player.GetCurrentCell(),targetCell);

            if(path == null){ // No path found
              console.log("Unable to find path for player")
              this._entity.GetBoardgame().GetPathFrom(player.GetCurrentCell(),targetCell);
              this._actionManager.AddActions(this._entity.GetGeneralTitleSequence(failMessages[Math.floor(Math.random() * failMessages.length)],0xd3a203,'./assets/signs.png'))

            } else if(path != null){

              this.RemoveListenersForCellInteraction(); // If we found a path, then lets remove the listeners
              this.MovePlayer(player, targetCell,path); // And move the player along the path
            }
          }
        })

        // Adding / removing the
        cell.on('pointerover',(e,b) => {
            let target = e.target;
            target.alpha = 0.8;
            target.once('pointerout',(e,b) => {
              target.alpha = 1.0;
            })
        })
      })
    })
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
                new ActionTween(cardRequired,"width",Tween.linear,cardRequired.width * 2,800,100),
                new ActionTween(cardRequired,"height",Tween.linear,cardRequired.height * 2,600,100),
                new ActionTween(cardRequired,"alpha",Tween.linear,1,0,100)
              ])
            )
            .AddAction(new ActionCustom(()=>{
              game.SetPlayerFoundCard(player,cardRequired);
              actionManager.AddActions(state._entity.GetGeneralTitleSequence(player.GetCardTarget() != null ? "Match Found!" : "Match Found! Run home!",0x342321))
                .AddAction(new ActionCustom(()=>{
                  state.PlayerMoveFinished();
                }))
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
