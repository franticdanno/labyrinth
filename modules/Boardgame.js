import { PLAYERS, SYMBOLS, CELL_TYPE } from './Constants.js'
import BoardGameCell from './BoardgameCell.js';
import KeyboardManager from './libs/input/KeyboardManager.js'

const CELL_SPRITE_SIZE = 114;

const CELL_ASSETS = {
  [CELL_TYPE.CORNER] : "cell_corner.png",
  [CELL_TYPE.JUNCTION] : "cell_junction.png",
  [CELL_TYPE.LINE] : "cell_line.png",
}

// Utility functions
const getRandomRotation = () => ( Math.floor(((Math.random() * 4) + 1)) * 90);
const emptyLineCell     = () => ( new BoardGameCell(CELL_TYPE.LINE,CELL_ASSETS[CELL_TYPE.LINE],null,getRandomRotation(),true))
const emptyCornerCell   = () => ( new BoardGameCell(CELL_TYPE.CORNER,CELL_ASSETS[CELL_TYPE.CORNER],null,getRandomRotation(),true))
const emptyJunctionCell = () => ( new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],getRandomRotation(),true))

const PLAYER_PIECES = {
  [PLAYERS.PLAYER_ONE] : "player_one.png",
  [PLAYERS.PLAYER_TWO] : "player_two.png",
  [PLAYERS.PLAYER_THREE] : "player_three.png",
  [PLAYERS.PLAYER_FOUR] : "player_four.png",
}

const DIRECTION = {
  NORTH : "north",
  SOUTH : "south",
  EAST : "east",
  WEST : "west"
}

export default class BoardGame extends PIXI.Container {

  constructor(game){
    super();
    this._game            = game;
    this.board            = null;
    this._playerContainers   = []
    this._possibleCells   = null;
    this._board_container = new PIXI.Container();
    this._boardBackground = new PIXI.Sprite.from("/assets/board_background.png")
    this._board_container.addChild(this._boardBackground);
    this._spareCell       = null;
    this._keyboardManager = new KeyboardManager();
    this._keyboardManager.Setup();
    //this._boardBackground.anchor.set(0.5,0.5);
    //this._board_container.pivot.x = this._boardBackground.width/2
    //this._board_container.pivot.y = this._boardBackground.height/2
  }

  Setup  = () => {
    this.PopulateBoardCells();
    this.BuildBoardgame();
  }

  PopulateBoardCells = () => {

    // Get together the list of possible cells that will be placed down on the board
    this._possibleCells = [
      new BoardGameCell(CELL_TYPE.CORNER,CELL_ASSETS[CELL_TYPE.CORNER],SYMBOLS[0],getRandomRotation(),true),
      new BoardGameCell(CELL_TYPE.CORNER,CELL_ASSETS[CELL_TYPE.CORNER],SYMBOLS[1],getRandomRotation(),true),
      new BoardGameCell(CELL_TYPE.LINE,CELL_ASSETS[CELL_TYPE.LINE],null,getRandomRotation(),true),
      emptyLineCell(),
      emptyCornerCell(),
      emptyLineCell(),
      emptyLineCell(),
      emptyCornerCell(),
      emptyCornerCell(),
      new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[2],getRandomRotation(),true),
      new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[3],getRandomRotation(),true),
      emptyCornerCell(),
      new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[4],getRandomRotation(),true),
      new BoardGameCell(CELL_TYPE.CORNER,CELL_ASSETS[CELL_TYPE.CORNER],SYMBOLS[5],getRandomRotation(),true),
      emptyCornerCell(),
      emptyCornerCell(),
      emptyCornerCell(),
      new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[6],getRandomRotation(),true),
      emptyCornerCell(),
      new BoardGameCell(CELL_TYPE.CORNER,CELL_ASSETS[CELL_TYPE.CORNER],SYMBOLS[7],getRandomRotation(),true),
      emptyLineCell(),
      emptyLineCell(),
      new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[8],getRandomRotation(),true),
      emptyLineCell(),
      emptyLineCell(),
      new BoardGameCell(CELL_TYPE.CORNER,CELL_ASSETS[CELL_TYPE.CORNER],SYMBOLS[9],getRandomRotation(),true),
      emptyLineCell(),
      emptyLineCell(),
      emptyLineCell(),
      new BoardGameCell(CELL_TYPE.CORNER,CELL_ASSETS[CELL_TYPE.CORNER],SYMBOLS[10],getRandomRotation(),true),
      emptyLineCell(),
      emptyCornerCell(),
      emptyLineCell(),
      new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[11],getRandomRotation(),true)
    ]

    const getCellFromPossibleCells = (possibleCells) => {
      let index = Math.floor(Math.random() * possibleCells.length)
      let fromPile = possibleCells[index] // Obtain a card from the pile
      possibleCells.splice(index,1)
      return fromPile
    }

    const getArrayOfPossibleCells = (possibleCells,num) => {
      let returnArray = []
      for(let i = 0; i < num; i++){
        returnArray.push(getCellFromPossibleCells(possibleCells));
      }
      return returnArray;
    }

    this.board = [
      [
        // Row 1
        new BoardGameCell(CELL_TYPE.CORNER,"cell_corner_player_1.png",PLAYERS.PLAYER_ONE,0,false),
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[12],0,false),
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[13],0,false) ,
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.CORNER,"cell_corner_player_2.png",PLAYERS.PLAYER_TWO,90,false),
      ],
      getArrayOfPossibleCells(this._possibleCells,7),
      [
        // Row 3
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[14],270,false),
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[15],270,false),
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[16],0,false) ,
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[17],90,false),
      ],
      getArrayOfPossibleCells(this._possibleCells,7),
      [
        // Row 5
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[18],270,false),
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[19],180,false),
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[20],90,false) ,
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[21],90,false),
      ],
      getArrayOfPossibleCells(this._possibleCells,7),
      [
        // Row 7
        new BoardGameCell(CELL_TYPE.CORNER,"cell_corner_player_3.png",PLAYERS.PLAYER_THREE,270,false),
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[22],180,false),
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.JUNCTION,CELL_ASSETS[CELL_TYPE.JUNCTION],SYMBOLS[23],180,false) ,
        getCellFromPossibleCells(this._possibleCells),
        new BoardGameCell(CELL_TYPE.CORNER,"cell_corner_player_4.png",PLAYERS.PLAYER_FOUR,180,false),
      ]
    ]
  }

  ResetBoardgameSpritePositions = () => {
    let board = this.board
    board.map((cells,row_index) => {
      cells.map((cell,cell_index) => {

        // Positions and sizes
        cell.x = 620 + (CELL_SPRITE_SIZE * cell_index)
        cell.y = 200 + (row_index * CELL_SPRITE_SIZE)
        cell.width = CELL_SPRITE_SIZE;
        cell.height = CELL_SPRITE_SIZE;
        //cell.rotation = (cell.rotation * 90) * Math.PI / 180;
        //cell.anchor.set(0.5,0.5)

      })
    })

    this.ResetSpareCell();
  }

  BuildBoardgame = () => {

    let board = this.board
    let sheet = PIXI.Loader.shared.resources["assets/boardgame_spritesheet.json"];

    board.map((cells,row_index) => {
      cells.map((cell,cell_index) => {

        // Positions and sizes
        cell.x = 620 + (CELL_SPRITE_SIZE * cell_index)
        cell.y = 200 + (row_index * CELL_SPRITE_SIZE)
        cell.width = CELL_SPRITE_SIZE;
        cell.height = CELL_SPRITE_SIZE;
        //cell.SafeRotate(cell.rotation)
        //cell.rotation = (cell.rotation * 90) * Math.PI / 180;
        //cell.anchor.set(0.5,0.5)

        this._board_container.addChild(cell);

      })
    })

    this._spareCell = this._possibleCells.pop(); // Tracking the spare cell

    //console.log("Boardgame Built, remaining cells:", this._spareCell)

    this.ShowSpareCell();

    this._board_container.x = 0;
    this._board_container.y = 0;
    this.addChild(this._board_container);
  }

  ResetSpareCell = () => {
    let cell = this._spareCell;
    cell.x = 237;
    cell.y = 520;
    cell.width = CELL_SPRITE_SIZE * 1.2;
    cell.height = CELL_SPRITE_SIZE * 1.2;
    //cell.anchor.set(0.5,0.5)
    //cell.rotation = 0;
    //cell.SafeRotate(0);
  }

  IsPlayerAssignedToSpareCell = (player) => {
    return player.GetCurrentCell() == this._spareCell ? true : false
  }

  IsPlayerAssignedToCell = (player,cell) => {
    return player.GetCurrentCell() == cell;
  }

  ShowSpareCell = () => {
    this.ResetSpareCell();
    this._board_container.addChild(this._spareCell);
  }

  GetBoardCellSpritesRow = (row) => {
    return this.board[row];
  }

  GetBoardCellSpritesColumn = (index) => {
    let returnCells = []
    for(let row = 0; row < this.board.length;row++){
      returnCells.push(this.board[row][index])
    }
    return returnCells;
  }

  SetSpareCell = (cell) => {
    this._spareCell = cell;
  }

  GetSpareCell = () => {
    return this._spareCell;
  }

  MovePlayersToCell = (players,cell) => {
    for(let player = 0; player < players.length; player++){
      players[player].SetCurrentCell(cell);
      let container = players[player].GetContainerRef()
      container.x = cell.x;
      container.y = cell.y;
    }

  }

  GetPlayersInSpareCell = () => {
    // Check if anyone went overboard
    let players = this.GetPlayers()
    let overboardPlayers = null
    players.forEach((player, i) => {
      if(this.IsPlayerAssignedToSpareCell(player)){
        if(overboardPlayers == null) overboardPlayers = []
        overboardPlayers.push(player);
      }
    });
    return overboardPlayers;
  }

  ShiftCellRow = (row,direction) => {

    if (direction == DIRECTION.EAST){

      console.log("Shifting cells EAST");

      // Add cell to the beginning and pop off the last cell
      this.board[row].unshift(this._spareCell);
      this.SetSpareCell(this.board[row].pop())

    } else if (direction == DIRECTION.WEST){

      console.log("Shifting cells WEST");

      // Add cell to the beginning and pop off the last cell
      this.board[row].push(this._spareCell);
      this.SetSpareCell(this.board[row].shift())
    }
  }



  ShiftCellColumn = (column,direction) => {

    let oldSpareCell = this._spareCell;

    if(direction == DIRECTION.SOUTH){

      console.log("Shifting cells SOUTH");

      // Pull the last cell off into the spare cell slot
      this.SetSpareCell(this.board[this.board.length-1][column]);

      // And startig from the bottom, move the cells up one place each
      for(let i = this.board.length-1; i > 0; i--){
        this.board[i][column] = this.board[i-1][column]
      }

      // Now set the new spot with the old spare
      this.board[0][column] = oldSpareCell;

    } else if (direction == DIRECTION.NORTH){

      console.log("Shifting cells NORTH");
      // Pull the first cell off into the spare cell slot
      this.SetSpareCell(this.board[0][column]);

      // And starting from the bottom, move the cells up one place each
      for(let i = 0; i < this.board.length - 1 ; i++){
        this.board[i][column] = this.board[i+1][column]
      }

      // Now set the new spot with the old spare
      this.board[this.board.length - 1][column] = oldSpareCell;
    }
  }

  GetBoardgameCellRow = (cell) => {
    for(let row = 0; row < this.board.length; row++){
      if(this.board[row].indexOf(cell) != -1) return row
    }
    return null
  }

  GetBoardgameCellIndex = (cell) => {
    for(let row = 0; row < this.board.length; row++){
      let index = this.board[row].indexOf(cell)
      if(index != -1) return index
    }
    return null
  }

  AddPlayersToBoard = (players) => {
    //console.log("Adding players to board",players)
    players.forEach((playerModel, i) => {

      let playerContainer = new PIXI.Container();
      let playerSprite = PIXI.Sprite.from(PLAYER_PIECES[playerModel.house])
      playerSprite.width = 48
      playerSprite.height = 48
      playerSprite.anchor.set(0.5,0.5);
      playerContainer.addChild(playerSprite)
      let houseCell = this.FindCellBySymbol(playerModel.house)
      //console.log("House:", item.house, "is", houseCell.x, houseCell.y)

      playerContainer.x = houseCell.x
      playerContainer.y = houseCell.y
      playerContainer.house = playerModel.house;
      //console.log("Cell found",houseCell,houseCell.x,houseCell.y);

      this._playerContainers.push(playerContainer);

      this._board_container.addChild(playerContainer)

      playerModel.SetContainerRef(playerContainer);
    });

  }

  GetPlayerContainersWithinCells = (cells) => {
    let players = this._game.GetPlayers()
    let returnPlayers = []
    for(let cellIndex = 0; cellIndex < cells.length; cellIndex++){
      for(let playerIndex = 0; playerIndex < players.length; playerIndex++ ){
        if(players[playerIndex].GetCurrentCell() == cells[cellIndex]){
          returnPlayers.push(players[playerIndex].GetContainerRef())
        }
      }
    }
    return returnPlayers;
  }

  GetPlayers = () => {
    return this._game.GetPlayers();
  }

  GetplayerContainer(player){
    return this._playerContainers[this._game.GetCurrentPlayerIndex()];
  }

  GetPlayerContainers = () =>{
    return this._playerContainers
  }

  FindPlayerByHouse = (house) => {
    for(let i = 0; i < this._playerContainers.length; i++){
      if(this._playerContainers[i].house == house) return this._playerContainers[i];
    }
  }

  GetCurrentPlayerContainer = () => {
    return this._playerContainers[this._game.GetCurrentPlayerIndex];
  }

  HighlightCurrentPlayer = () => {
    for(let i = 0; i < this._playerContainers.length; i++){
      if(i == this._game.GetCurrentPlayerIndex()){
        this._playerContainers[i].scale.x = 1.8;
        this._playerContainers[i].scale.y = 1.8;
      } else {
        this._playerContainers[i].scale.x = 1.0;
        this._playerContainers[i].scale.y = 1.0;
      }
    }
  }

  FindCellBySymbol = (symbol) => {
    let board = this.board
    let cellFound = null;
    for(let row_index = 0; row_index < board.length; row_index++){
      for(let cell_index = 0; cell_index < board[row_index].length; cell_index++){
        if(board[row_index][cell_index].GetSymbol() == symbol){
          return board[row_index][cell_index]
        }
      }
    }
    return null
  }

  GetBoardCells = () => {
    return this.board;
  }

  CheckConnection = (cellOne,cellTwo,direction) => {

    //return true;

    //console.log("Checking connection",cellOne,cellTwo,direction)

    switch(direction){
      case DIRECTION.NORTH:
        return cellOne.GetLinks()[0] == true && cellTwo.GetLinks()[2] == true
        break;
      case DIRECTION.EAST:
        return cellOne.GetLinks()[1] == true && cellTwo.GetLinks()[3] == true
        break;
      case DIRECTION.SOUTH:
        return cellOne.GetLinks()[2] == true && cellTwo.GetLinks()[0] == true
        break;
      case DIRECTION.WEST:
        return cellOne.GetLinks()[3] == true && cellTwo.GetLinks()[1] == true
        break;
    }

    return false;
  }

  IsDrawingConnectingNodes = () => {
    return this._nodes != null
  }

  StopDrawConnectingNodes = () => {
    if(this._nodes != null){
      this._nodes.destroy()
      this._nodes = null;
      this._board_container.removeChild(this._nodes);
    }
  }

  DrawConnectingNodes = () => {

    this.StopDrawConnectingNodes();

    this._nodes = new PIXI.Graphics();
    let board_rows = this.board
    this._nodes.lineStyle(2, 0xFFFFFF, 1);
    for(let row = 0; row < board_rows.length; row++){
      for(let cell = 0; cell < board_rows[row].length; cell++){
        this._nodes.beginFill(0xAA4F08);
        let cellSprite = board_rows[row][cell]
        this._nodes.drawCircle(cellSprite.x, cellSprite.y, 10);
        let links = cellSprite.GetLinks()

        this._nodes.beginFill(0xCCCCCC);

        if(links[0] == true) this._nodes.drawCircle(cellSprite.x, cellSprite.y - 40, 5);
        if(links[1] == true) this._nodes.drawCircle(cellSprite.x + 40, cellSprite.y, 5);
        if(links[2] == true) this._nodes.drawCircle(cellSprite.x, cellSprite.y + 40, 5);
        if(links[3] == true) this._nodes.drawCircle(cellSprite.x - 40, cellSprite.y, 5);

        this._nodes.lineTo(0,0);

        //drawing.drawRect(cell.x, cell.y, cell.x + 50, cell.y + 50);
      }
    }
    this._nodes.endFill();
    //console.log("About to show links",this,this._board_container,drawing)

    this._board_container.addChild(this._nodes);
  }

  GetNeighbouringCells = (cell) => {

    let board_rows = this.board;
    for(let row = 0; row < board_rows.length; row++ )
    {
      //console.log("Looking for the cell position in row",row)
      let pos = board_rows[row].indexOf(cell);
      if(pos != -1){

        //console.log("Found cell position",pos)

        let neighbours = []

        // Check North
        if(row != 0 && this.CheckConnection(cell,board_rows[row-1][pos],DIRECTION.NORTH)){
          neighbours.push(board_rows[row - 1][pos]);
          //console.log("NEIGHBOUR FOUND: NORTH")
        }

        // Check East
        if(pos < board_rows[row].length - 1 && this.CheckConnection(cell,board_rows[row][pos+1],DIRECTION.EAST)){
          neighbours.push(board_rows[row][pos+1]);
          //console.log("NEIGHBOUR FOUND: EAST")
        }

        // Check West
        if(pos != 0 && this.CheckConnection(cell,board_rows[row][pos-1],DIRECTION.WEST)){
          neighbours.push(board_rows[row][pos-1]);
          //console.log("NEIGHBOUR FOUND: WEST")
        }

        // Check South
        if(row != board_rows.length - 1 && this.CheckConnection(cell,board_rows[row+1][pos],DIRECTION.SOUTH)){
          neighbours.push(board_rows[row + 1][pos]);
          //console.log("NEIGHBOUR FOUND: SOUTH")
        }

        //console.log("Identified neighbours",neighbours)
        return neighbours;
      }
    }
  }

  GetPathFrom = (startCell,targetCell) => {
      /*console.log("Getting path from",
      this.GetBoardgameCellRow(startCell),
      this.GetBoardgameCellIndex(startCell),
      "to",this.GetBoardgameCellRow(targetCell),
      this.GetBoardgameCellIndex(targetCell))*/

    //startCell.scale = 1.2;
    //targetCell.scale = 1.2;

    let frontier = []; // This is the list of cells we're going to be traversing
    frontier.push(startCell); // So lets add the very first cell to it

    let came_from = {}; // This is going to track where each cell came from
    let current = null;

    //let alpha = 0.1
    while (frontier.length > 0) // While there is something to check in the list
    {
      current = frontier.shift(); // Get the item from the front of the queue

      if(current == targetCell){ // If it matches the target then we're done!
        console.log("Found the target cell, time to generate path")
        break;
      }

      // Lets find all of the neighbours so that we can add them to the list
      // and check their neighbours and theirs and theirs etc
      let neighbours = this.GetNeighbouringCells(current);

      neighbours.forEach((neighbour, i) => { // Lets go through all of the neighbours
        if(!came_from[neighbour.GetID()]){ // First check to see if we haven't already visited the neighbour
          //neighbour.alpha = 0.2
          frontier.push(neighbour); // Since we haven't visited it, lets add it to the pile of investigations
          came_from[neighbour.GetID()] = current; // and now we specify that we got to the neighbour from the current tile
        }
      });

    }
    // Check if there is a path
    if(!came_from[targetCell.GetID()]){ // If there was no linking path to the final cell
      console.log("NO PATH FOUND");
      return null
    }

    // Time to construct the path now
    let path = []
    current = targetCell;
    let loopcount = 0
    while (current != startCell){
      path.unshift(current);
      current = came_from[current.GetID()];
    }
    path.unshift(startCell); // Finally add the start cell to the list

    /* console.log("----- PATH ------")
    path.forEach((cell, i) => {
      console.log("row:",this.GetBoardgameCellRow(cell),"column:",this.GetBoardgameCellIndex(cell));
    }); */

    console.log("----- END ------")

    return path;
  }

}
