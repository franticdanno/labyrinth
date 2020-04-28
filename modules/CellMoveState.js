import { Action, ParallelAction,SequenceAction } from './actions/Action.js'
import { ActionShowText } from './actions/ActionShowText.js'
import { ActionSleep } from './actions/ActionSleep.js'
import { ActionCustom } from './actions/ActionCustom.js'
import { ActionFollowPath } from './actions/ActionFollowPath.js'
import BaseState from './BaseState.js'
import BoardGame from './Boardgame.js';
import { HOUSE, CHARACTER, CELL_TYPE } from './Constants.js'
import Card from './Card.js';

export default class CellMoveState extends BaseState {

  constructor(entity){
    super(entity);
  }

  Enter = () => {

    this._actionManager = new SequenceAction()
    this._actionManager.AddAction(new ActionShowText(this._entity,"Move:" + this._entity.GetCurrentPlayer().GetHouse(),1))
      .AddAction(new ActionCustom((params)=>{
        params.entity.GetBoardgame().HighlightCurrentPlayer();
      },{entity:this._entity}))
      .AddAction(new ActionCustom((params) => {
        params.entity.ListenForCellInteraction();
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

    let board = this._entity.GetBoardgame().GetBoardCells();

    console.log("Setting up for Cell Interaction");

    board.forEach((cell_row, cell_row_index) => {
      return cell_row.forEach((cell, cell_index) => {

        if(!cell.CanMove()) return // Don't add listeners that cannot be moved
        if(cell_row_index > 0 && cell_row_index < board.length - 1 && cell_index > 0 && cell_index < cell_row.length - 1) return; // Don't add listeners to anything in the middle of the board

        cell.interactive = true;
        cell.buttonMode = true;

        cell.on('pointerdown',(e,b)=>{

          console.log("TILE CLICKED",cell_row_index,cell_index)

        })

        cell.on('pointerover',(e,b) => {
            let target = e.target;
            target.alpha = 0.5;
            console.log("pointer over")
            target.once('pointerout',(e,b) => {
              console.log("pointer out")
              target.alpha = 1.0;
            })
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


  GetStateName(){
    return "Main Game State";
  }
}
