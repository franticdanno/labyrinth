import { HOUSE, CHARACTER, CELL_TYPE } from './Constants.js'
import Card from './Card.js';
import Player from './Player.js';
import BoardGameCell from './BoardgameCell.js';

const CELL_SPRITE_SIZE = 224;

// Utility functions
const getRandomRotation = () => ( Math.floor(((Math.random() * 4) + 1)) );
const emptyLineCell     = () => ( new BoardGameCell(CELL_TYPE.LINE,null,getRandomRotation(),true))
const emptyCornerCell   = () => ( new BoardGameCell(CELL_TYPE.CORNER,null,getRandomRotation(),true))
const emptyJunctionCell = () => ( new BoardGameCell(CELL_TYPE.JUNCTION,null,getRandomRotation(),true))

const PLAYER_PIECES = {
  [HOUSE.GRYFFINDOR] : "player_one.png",
  [HOUSE.RAVENCLAW] : "player_two.png",
  [HOUSE.HUFFLEPUFF] : "player_three.png",
  [HOUSE.SLYTHERIN] : "player_four.png"
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
    this._playerSprites   = []
    this._board_container = new PIXI.Container();;
  }

  Setup  = () => {
    this.PopulateBoardCells();
    this.BuildBoardgame();
  }

  PopulateBoardCells = () => {

    // Get together the list of possible cells that will be placed down on the board
    const possibleCells = [
      new BoardGameCell(CELL_TYPE.CORNER,CHARACTER.LUNA,getRandomRotation(),true),
      new BoardGameCell(CELL_TYPE.CORNER,CHARACTER.SEVERUS,getRandomRotation(),true),
      new BoardGameCell(CELL_TYPE.LINE,null,getRandomRotation(),true),
      emptyLineCell(),
      emptyCornerCell(),
      emptyLineCell(),
      emptyLineCell(),
      emptyCornerCell(),
      emptyCornerCell(),
      new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.LUPIN,getRandomRotation(),true),
      new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.MOODY,getRandomRotation(),true),
      emptyCornerCell(),
      new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.QUIRREL,getRandomRotation(),true),
      new BoardGameCell(CELL_TYPE.CORNER,CHARACTER.MALFOY,getRandomRotation(),true),
      emptyCornerCell(),
      emptyCornerCell(),
      emptyCornerCell(),
      new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.RON,getRandomRotation(),true),
      emptyCornerCell(),
      new BoardGameCell(CELL_TYPE.CORNER,CHARACTER.MALFOY,getRandomRotation(),true),
      emptyLineCell(),
      emptyLineCell(),
      new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.DOLORES,getRandomRotation(),true),
      emptyLineCell(),
      emptyLineCell(),
      new BoardGameCell(CELL_TYPE.CORNER,CHARACTER.GINNY,getRandomRotation(),true),
      emptyLineCell(),
      emptyLineCell(),
      emptyLineCell(),
      new BoardGameCell(CELL_TYPE.CORNER,CHARACTER.LUNA_ODD,getRandomRotation(),true),
      emptyLineCell(),
      emptyCornerCell(),
      emptyCornerCell(),
      emptyLineCell(),
      new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.GRINGOTT,getRandomRotation(),true)
    ]

    const getCellFromPossibleCells = () => {
      let index = Math.floor(Math.random() * possibleCells.length)
      let fromPile = possibleCells[index] // Obtain a card from the pile
      possibleCells.splice(index,1)
      return fromPile
    }

    const getArrayOfPossibleCells = (num) => {
      let returnArray = []
      for(let i = 0; i < num; i++){
        returnArray.push(getCellFromPossibleCells());
      }
      return returnArray;
    }

    this.board = [
      [
        // Row 1
        new BoardGameCell(CELL_TYPE.CORNER,HOUSE.HUFFLEPUFF,0,false),
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.HARRY,0,false),
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.WHO,0,false) ,
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.CORNER,HOUSE.SLYTHERIN,1,false),
      ],
      getArrayOfPossibleCells(7),
      [
        // Row 3
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.LONGBOTTOM,3,false),
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.SNAPE,3,false),
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.SYBILL,0,false) ,
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.MCGONAGALL,1,false),
      ],
      getArrayOfPossibleCells(7),
      [
        // Row 5
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.VOLDEMOORT,3,false),
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.HAGRID,2,false),
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.DOBBY,1,false) ,
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.DUMBLEDORE,1,false),
      ],
      getArrayOfPossibleCells(7),
      [
        // Row 7
        new BoardGameCell(CELL_TYPE.CORNER,HOUSE.GRYFFINDOR,3,false),
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.HERMIONE,2,false),
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.JUNCTION,CHARACTER.RUFUS,2,false) ,
        getCellFromPossibleCells(),
        new BoardGameCell(CELL_TYPE.CORNER,HOUSE.RAVENCLAW,2,false),
      ]
    ]
  }

  BuildBoardgame = () => {

    let board = this.board
    let sheet = PIXI.Loader.shared.resources["assets/boardgame_spritesheet.json"];

    board.map((cells,row_index) => {
      cells.map((cell,cell_index) => {

        cell.x = CELL_SPRITE_SIZE * cell_index
        cell.y = row_index * CELL_SPRITE_SIZE
        cell.pivot.x = 0;
        cell.pivot.y = 0;

        cell.width = CELL_SPRITE_SIZE;
        cell.height = CELL_SPRITE_SIZE;

        cell.rotation = (cell.rotation * 90) * Math.PI / 180;

        this._board_container.addChild(cell);

      })
    })

    this._board_container.x += 200;
    this._board_container.y += 110;
    this.addChild(this._board_container);
  }

  AddPlayersToBoard = (players) => {
    console.log("Adding players to board",players)
    players.forEach((item, i) => {

      let playerSprite = new PIXI.Sprite.from(PLAYER_PIECES[item.house])
      let houseCell = this.FindCellBySymbol(item.house)

      playerSprite.x = houseCell.x
      playerSprite.y = houseCell.y
      playerSprite.house = item.house;
      //console.log("Cell found",houseCell,houseCell.x,houseCell.y);

      this._playerSprites.push(playerSprite);

      this._board_container.addChild(playerSprite)
    });

  }

  GetPlayerSprite(player){
    return this._playerSprites[0];
  }

  FindPlayerByHouse = (house) => {
    for(let i = 0; i < this._playerSprites.length; i++){
      if(this._playerSprites[i].house == house) return this._playerSprites[i];
    }
  }

  HighlightCurrentPlayer = () => {
    let house = this._game.GetCurrentPlayer().GetHouse()
    console.log("Looking to highlight",house)
    let playerSprite = this.FindPlayerByHouse(house)
    console.log("Found player",playerSprite);
  }

  FindCellBySymbol = (symbol) => {
    let board = this.board
    let cellFound = null;
    board.forEach((cell_row, i) => {
      return cell_row.forEach((cell, i) => {
        //console.log("Checking",cell.symbol,symbol)
        if(cell.symbol == symbol) cellFound = cell;
      });
    });
    return cellFound
    //console.log("Unable to find cell");
  }

  GetBoardCells = () => {
    return this.board;
  }

  CheckConnection = (cellOne,cellTwo,direction) => {

    console.log("Checking connection",cellOne.GetID(),cellTwo.GetID(),direction)

    switch(direction){
      case DIRECTION.NORTH:
        return cellOne.GetLinks()[0] == cellTwo.GetLinks()[2]
        break;
      case DIRECTION.EAST:
        return cellOne.GetLinks()[1] == cellTwo.GetLinks()[3]
        break;
      case DIRECTION.SOUTH:
        return cellOne.GetLinks()[2] == cellTwo.GetLinks()[0]
        break;
      case DIRECTION.WEST:
        return cellOne.GetLinks()[3] == cellTwo.GetLinks()[1]
        break;
    }

    return false;
  }

  GetNeighbouringCells = (cell) => {

    let board_rows = this.board;
    for(let row = 0; row < board_rows.length; row++ )
    {
      console.log("Looking for the cell position in row",row)
      let pos = board_rows[row].indexOf(cell);
      if(pos != -1){

        console.log("Found cell position",pos)

        let neighbours = []

        // Check North
        if(row != 0 && this.CheckConnection(cell,board_rows[row-1][pos],DIRECTION.NORTH)){
          neighbours.push(board_rows[row - 1][pos]);
          console.log("NEIGHBOUR FOUND: NORTH")
        }

        // Check East
        if(pos < board_rows[row].length - 1 && this.CheckConnection(cell,board_rows[row][pos+1],DIRECTION.EAST)){
          neighbours.push(board_rows[row][pos+1]);
          console.log("NEIGHBOUR FOUND: EAST")
        }

        // Check West
        if(pos != 0 && this.CheckConnection(cell,board_rows[row][pos-1],DIRECTION.WEST)){
          neighbours.push(board_rows[row][pos-1]);
          console.log("NEIGHBOUR FOUND: WEST")
        }

        // Check South
        if(row != board_rows.length - 1 && this.CheckConnection(cell,board_rows[row+1][pos],DIRECTION.SOUTH)){
          neighbours.push(board_rows[row + 1][pos]);
          console.log("NEIGHBOUR FOUND: SOUTH")
        }

        console.log("Identified neighbours",neighbours)
        return neighbours;
      }
    }
  }

  GetPathFrom = (cellOne,targetCell) => {
    console.log("Getting path from",cellOne.GetID(),"to",targetCell.GetID());

    let frontier = []; // This is the list of cells we're going to be traversing
    frontier.push(cellOne); // So lets add the very first cell to it

    let came_from = {}; //
    let current = null;

    let alpha = 0.1
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

      neighbours.forEach((next, i) => { // Lets go through all of the neighbours
        if(!came_from[next.GetID()]){
          frontier.push(next);
          came_from[next.GetID()] = current;
        }
      });

    }

    console.log("SO we found the target. Construction time!")

    // Time to construct the path now
    let path = []
    current = targetCell;
    let loopcount = 0
    while (current != cellOne){
      path.unshift(current); //

      current = came_from[current.GetID()];
      console.log(current,cellOne)

      loopcount++
      if(loopcount>= 10) break;
    }
    path.unshift(cellOne);
    path.reverse();

    let pathstring = ""
    path.forEach((node, i) => {
      node.alpha = (1.0 / path.length) * i
      pathstring = pathstring + " " + node.GetID();
    });
    console.log("Path: ",pathstring);


    return path;
  }

}
