import { Action, ParallelAction,SequenceAction } from './actions/Action.js'
import { ActionShowText } from './actions/ActionShowText.js'
import { ActionSleep } from './actions/ActionSleep.js'
import { ActionCustom } from './actions/ActionCustom.js'
import { ActionFollowPath } from './actions/ActionFollowPath.js'
import { ActionMoveTiles } from './actions/ActionMoveTiles.js'
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

    console.log("Boardgame has been set up!",this)
  }

  Update = (delta) => {
    //console.log("Main Game State");
    if(this._actionManager != null) this._actionManager.Update(delta);
  }

  Exit = () => {

  }

  ListenForCellInteraction = () => {

    let game = this._entity;
    let boardgame = this._entity.GetBoardgame();
    let board = boardgame.GetBoardCells();
    let actionManager = this._actionManager;
    let state = this

    console.log("Setting up for Cell Interaction");

    function cellClicked(cell){

      state.RemoveListenersForCellInteraction() // Disable cell clicking now that the user's chose their move

      let cellRow = boardgame.GetBoardgameCellRow(cell);
      let cellIndex = boardgame.GetBoardgameCellIndex(cell)

      //actionManager.AddAction(new ActionShowText(game,"Row: " + cell.GetRow() + " Index: " + cell.GetIndex(),1))
      if(cellRow == 0 || cellRow == board.length - 1){

        let sprites = boardgame.GetBoardCellSpritesColumn(cellIndex)
        //console.log("It's a column!",sprites)
        let direction = cellRow == 0 ? DIRECTION.SOUTH : DIRECTION.NORTH

        actionManager.AddAction(new ActionMoveTiles(sprites, direction))
          .AddAction(new ActionCustom(()=>{
            boardgame.ShiftCellColumn(cellIndex,direction)
            boardgame.ResetBoardgameSpritePositions()
          }))
          .AddAction(new ActionCustom(()=>{
            game.ChangeState(new PlayerMoveState(game))
          }))

      } else {

        let sprites = boardgame.GetBoardCellSpritesRow(cellRow)
        //console.log("It's a row!",sprites);
        let direction = cellIndex == 0 ? DIRECTION.EAST : DIRECTION.WEST
        actionManager.AddAction(new ActionMoveTiles(sprites, direction))
          .AddAction(new ActionCustom(()=>{
            boardgame.ShiftCellRow(cellRow,direction)
            boardgame.ResetBoardgameSpritePositions()
          }))
          .AddAction(new ActionCustom(()=>{
            game.ChangeState(new PlayerMoveState(game))
          }))

      }

      //console.log(boardgame.GetBoardCellSpritesRow(cell.GetRow()))
    }

    board.forEach((cell_row, cell_row_index) => {
      return cell_row.forEach((cell, cell_index) => {

        if(!cell.CanMove()) return // Don't add listeners that cannot be moved
        if(cell_row_index > 0 && cell_row_index < board.length - 1 && cell_index > 0 && cell_index < cell_row.length - 1) return; // Don't add listeners to anything in the middle of the board

        cell.interactive = true;
        cell.buttonMode = true;

        cell.on('pointerdown',(e,b)=>{

          let cellClickedTarget = e.target;
          //console.log(cellClicked.width,cellClicked.height);
          cellClicked(cellClickedTarget);

          //console.log("TILE CLICKED",cell_row_index,cell_index)

        })

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
