import { Action, ParallelAction,SequenceAction } from './actions/Action.js'
import { ActionShowText } from './actions/ActionShowText.js'
import { ActionSleep } from './actions/ActionSleep.js'
import { ActionCustom } from './actions/ActionCustom.js'
import { ActionFollowPath } from './actions/ActionFollowPath.js'
import { Tween } from './libs/Tween.js'
import { ActionGroupTween } from './actions/ActionGroupTween.js'
import { ActionTween } from './actions/ActionTween.js'
import PlayerMoveState from './PlayerMoveState.js'
import BaseState from './BaseState.js'
import BoardGame from './Boardgame.js'
import { HOUSE, CHARACTER, CELL_TYPE,DIRECTION } from './Constants.js'
import Card from './Card.js';

export default class CellMoveState extends BaseState {

  constructor(entity){
    super(entity);
  }

  Enter = () => {

    let boardgame = this._entity.GetBoardgame()

    this._actionManager = new SequenceAction()
    this._actionManager.AddAction(new ActionShowText(this._entity,"Player " + (this._entity.GetCurrentPlayerIndex() + 1),1))
      .AddAction(new ActionCustom((params)=>{
        params.entity.GetBoardgame().HighlightCurrentPlayer();
      },{entity:this._entity}))
      .AddAction(new ActionCustom((params) => {
        params.entity.ListenForCellInteraction();
        boardgame.EnableSpareCellRotation();
      },{entity: this}))

    //console.log("Boardgame has been set up!",this)
  }

  Update = (delta) => {
    //console.log("Main Game State");
    if(this._entity.GetBoardgame()._keyboardManager.IsKeyDown('k')){
      if(!this._entity.GetBoardgame().IsDrawingConnectingNodes()){
        this._entity.GetBoardgame().DrawConnectingNodes();
      }
    }

    if(this._entity.GetBoardgame()._keyboardManager.IsKeyDown('l')){
      if(this._entity.GetBoardgame().IsDrawingConnectingNodes()){
        this._entity.GetBoardgame().StopDrawConnectingNodes();
      }
    }

    if(this._actionManager != null) this._actionManager.Update(delta);

  }

  Exit = () => {

  }

  ListenForCellInteraction = () => {

    let boardgame = this._entity.GetBoardgame();
    let board = boardgame.GetBoardCells();
    let state = this;

    board.forEach((cell_row, cell_row_index) => {
      return cell_row.forEach((cell, cell_index) => {

        if(!cell.CanMove()) return // Don't add listeners that cannot be moved
        if(cell_row_index > 0 && cell_row_index < board.length - 1 && cell_index > 0 && cell_index < cell_row.length - 1) return; // Don't add listeners to anything in the middle of the board

        cell.interactive = true;
        cell.buttonMode = true;

        cell.on('pointerdown',(e,b)=>{ state.MoveCells(e.target); })

        cell.on('pointerover',(e,b) => {
            let target = e.target;
            target.alpha = 0.5;
            //console.log("pointer over")
            target.once('pointerout',(e,b) => {
              //console.log("pointer out")
              target.alpha = 1.0;
            })
        })
      });
    });
  }


  MoveCells = (cell) => {

    function getMoveDirection(cellRow,cellIndex){
        if(cellRow == 0) return DIRECTION.SOUTH;
        if(cellRow == board.length - 1) return DIRECTION.NORTH;
        if(cellIndex == 0) return DIRECTION.EAST;
        return DIRECTION.WEST;
    }

    let game = this._entity;
    let boardgame = this._entity.GetBoardgame();
    let board = boardgame.GetBoardCells();
    let actionManager = this._actionManager;
    let state = this

    boardgame.DisableSpareCellRotation() // No point being able to rotate the spare cell now...
    state.RemoveListenersForCellInteraction() // Disable cell clicking now that the user's chose their move

    let cellRow     = boardgame.GetBoardgameCellRow(cell); // Get the row of the cell
    let cellIndex   = boardgame.GetBoardgameCellIndex(cell) // Get the column / index of the cell
    let direction   = getMoveDirection(cellRow,cellIndex);

    let previousSpareCell = boardgame.GetSpareCell()
    let player = game.GetCurrentPlayer()
    let playerContainer = game.GetBoardgame().GetplayerContainer();

    let cellContainers = (direction == DIRECTION.SOUTH || direction == DIRECTION.NORTH) ? boardgame.GetBoardCellSpritesColumn(cellIndex) : boardgame.GetBoardCellSpritesRow(cellRow)
    let change = (direction == DIRECTION.SOUTH || direction == DIRECTION.EAST ? 114 : -114)

    let playersWithinCells = boardgame.GetPlayerContainersWithinCells(cellContainers);

    // Lets set it up to move the player's piece if we need to
    let actions = []
    let coordinate = direction == DIRECTION.SOUTH || direction == DIRECTION.NORTH ? "y" : "x"
    actions.unshift(new ActionGroupTween(cellContainers,coordinate,Tween.easeOutQuad,change,70 ))
    if(playersWithinCells.length > 0){
      actions.unshift(new ActionGroupTween(playersWithinCells,coordinate,Tween.easeOutQuad,change, 70))
    }

    actionManager
      .AddAction(new ParallelAction(actions))
      .AddAction(new ActionCustom(()=>{

        (direction == DIRECTION.SOUTH || direction == DIRECTION.NORTH) ? boardgame.ShiftCellColumn(cellIndex,direction) : boardgame.ShiftCellRow(cellRow,direction);

        boardgame.ResetBoardgameSpritePositions()

        let overboardPlayers = boardgame.GetPlayersInSpareCell()

        if(overboardPlayers!= null){
          console.log("Players overboard!",overboardPlayers)
          boardgame.MovePlayersToCell(overboardPlayers,previousSpareCell);
        }

      }))
      .AddAction(new ActionCustom(()=>{
        game.ChangeState(new PlayerMoveState(game))
      }));
  }



  RemoveListenersForCellInteraction = () => {
    let board = this._entity.GetBoardgame().GetBoardCells();
    //console.log("Removing listeners",board);
    board.forEach((cell_row, i) => {
      return cell_row.forEach((cell, i) => {
        //console.log("Removing listener")
        cell.interactive = false;
        cell.buttonMode = false;
        cell.alpha = 1.0;
        cell.removeListener('pointerdown')
        cell.removeListener('pointerover')
      });
    });
  }


  GetStateName(){
    return "Main Game State";
  }
}
