// Library imports
import { ParallelAction,SequenceAction } from './libs/action/Action.js'
import { ActionCustom } from './libs/action/ActionCustom.js'
import { ActionGroupTween } from './libs/action/ActionGroupTween.js'
import { ActionTween } from './libs/action/ActionTween.js'
import { ActionTweenCustom } from './libs/action/ActionTweenCustom.js'
import { Tween } from './libs/tween/Tween.js'
import { TWEEN_BEHAVIOUR } from './libs/tween/TweenConstants.js'
import BaseState from './libs/state/BaseState.js'

// Custom file imports
import { ActionShowText } from './custom_actions/ActionShowText.js'
import PlayerMoveState from './PlayerMoveState.js'
import BoardGame from './Boardgame.js'
import { DIRECTION } from './Constants.js'

export default class CellMoveState extends BaseState {

  constructor(entity){
    super(entity);

    this._rotateSprite = null;

  }

  Enter = () => {

    let boardgame = this._entity.GetBoardgame()
    let state = this

    this._actionManager = new SequenceAction()
    this._actionManager.AddAction(new ActionShowText(this._entity,"Player " + (this._entity.GetCurrentPlayerIndex() + 1),1))
      .AddAction(new ActionCustom((params)=>{
        params.entity.GetBoardgame().HighlightCurrentPlayer();
      },{entity:this._entity}))
      .AddAction(new ActionCustom((params) => {
        state.ShowRotationIcon();
        state.EnableSpareCellRotationListener();
        params.entity.ListenForCellInteraction();
        //boardgame.EnableSpareCellRotation();
      },{entity: this}))

    //console.log("Boardgame has been set up!",this)
  }

  EnableSpareCellRotationListener = () => {
    let sparecell = this._entity.GetBoardgame().GetSpareCell();
    let actionManager = this._actionManager;
    let state = this

    sparecell.interactive = true;
    sparecell.buttonmode = true;

    sparecell.once("pointerdown",()=>{

        actionManager.AddActions([
          new ActionCustom(()=>{
            state.DisableSpareCellRotationListener();
          }),
          new ActionTweenCustom(sparecell,(entity,value)=>{
            entity.SetSafeRotate(value)
          },Tween.easeInOutQuad, sparecell.rotation * 180/Math.PI,sparecell.rotation * 180 /Math.PI + 90, 500),
          new ActionCustom(()=>{
            state.EnableSpareCellRotationListener();
          }),
        ])
        /*.AddAction(new ActionCustom(()=>{
          sparecell.SafeRotate(90);
        }))*/
    })
  }

  DisableSpareCellRotationListener = () => {
    let sparecell = this._entity.GetBoardgame().GetSpareCell();
    sparecell.removeListener('pointerdown');
  }

  Update = (delta,b,c) => {

    if(this._totalTime == null){ this._totalTime = 0;}
    this._totalTime += delta

    //console.log("Cell Move State",this._totalTime)

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
    if(this._rotateSprite != null && this._rotateSprite._actionManager !=null) this._rotateSprite._actionManager.Update(delta);

  }

  Exit = () => {

  }

  ShowRotationIcon = () => {
    let boardgame = this._entity.GetBoardgame();
    let spareCell = boardgame.GetSpareCell()

    if(this._rotateSprite == null){
      this._rotateSprite = new PIXI.Sprite.from('./assets/refresh.png')
    }
    this._rotateSprite.x = spareCell.x;
    this._rotateSprite.y = spareCell.y + spareCell.height/2 + 70;
    this._rotateSprite.anchor.set(0.5,0.5);
    this._rotateSprite.alpha = 0;

    let rotSprite = this._rotateSprite;
    rotSprite._actionManager = new ParallelAction();
    rotSprite._actionManager.AddAction(new ActionTween(rotSprite,"alpha",Tween.linear,0,1,500))
    rotSprite._actionManager.AddAction(new ActionTween(rotSprite,"width",Tween.easeInQuad,300,80,500))
    rotSprite._actionManager.AddAction(new ActionTween(rotSprite,"height",Tween.easeInQuad,300,80,500))
    rotSprite._actionManager.AddAction(new ActionTween(rotSprite,"rotation",Tween.easeInOutQuart,0,2*Math.PI,1500,TWEEN_BEHAVIOUR.REPEAT))

    boardgame.addChild(this._rotateSprite);

  }

  HideRotationIcon = () => {

    let boardgame = this._entity.GetBoardgame();
    let rotSprite = this._rotateSprite;

    rotSprite._actionManager.StopAllActions();

    rotSprite._actionManager.AddAction(
        new ParallelAction([
          new ActionTween(rotSprite,"alpha",Tween.linear,1,0,300),
          new ActionTween(rotSprite,"width",Tween.easeInQuad,80,120,300),
          new ActionTween(rotSprite,"height",Tween.easeInQuad,80,120,300),
        ])
      )
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

    this.HideRotationIcon()

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

    //boardgame.DisableSpareCellRotation() // No point being able to rotate the spare cell now...
    state.DisableSpareCellRotationListener();
    state.RemoveListenersForCellInteraction(); // Disable cell clicking now that the user's chose their move

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
    actions.unshift(new ActionGroupTween(cellContainers,coordinate,Tween.easeInOutQuart,change,1000 ))
    if(playersWithinCells.length > 0){
      actions.unshift(new ActionGroupTween(playersWithinCells,coordinate,Tween.easeInOutQuart,change, 1000))
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
