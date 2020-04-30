import { HOUSE, CHARACTER, CELL_TYPE } from './Constants.js'

const CELL_IMAGES = {
  [CELL_TYPE.CORNER] : "cell_corner.png",
  [CELL_TYPE.JUNCTION] : "cell_junction.png",
  [CELL_TYPE.LINE] : "cell_line.png",
}

const CELL_IMAGES_FANCY = {
  [CELL_TYPE.CORNER] : "cell_corner_fancy.png",
  [CELL_TYPE.JUNCTION] : "cell_junction_fancy.png",
  [CELL_TYPE.LINE] : "cell_line_fancy.png",
}

const CELL_TYPE_LINKS = {
  [CELL_TYPE.CORNER] : [false,true,true,false],
  [CELL_TYPE.JUNCTION] : [false,true,true,true],
  [CELL_TYPE.LINE] : [false,true,false,true]
}

let currentCardCount = 0

export default class BoardGameCell extends PIXI.Sprite {

  constructor(celltype,symbol,rotation,canMove){

    //super(Math.random() > 0.9 ? PIXI.Texture.from(CELL_IMAGES_FANCY[celltype]) : PIXI.Texture.from(CELL_IMAGES[celltype]))
    super(PIXI.Texture.from(CELL_IMAGES[celltype]))
    this.celltype   = celltype;
    this.rotation   = rotation;
    this.symbol     = symbol;
    this.canMove    = canMove;
    this.players    = [];
    this.links      = [...CELL_TYPE_LINKS[celltype]]; // Copy the link array for the cell
    this.cardID     = currentCardCount++;
    this.row        = 0;
    this.index      = 0

  }

  CanMove = () => {
    return this.canMove;
  }

  GetLinks = () => {
    let og = CELL_TYPE_LINKS[this.celltype]
    let currentRotation = ((this.rotation * (180/Math.PI)) / 90) % 4;
    console.log("Getting Links",this.rotation,og,currentRotation);
    switch (currentRotation){
      case 0:
        return [og[0],og[1],og[2],og[3]]
        break;
      case 1:
        return [og[3],og[0],og[1],og[2]]
        break
      break;
      case 2:
        return [og[2],og[3],og[0],og[1]]
        break;
      case 3:
        return [og[1],og[2],og[3],og[0]]
        break;
    }
  }

  GetSymbol = () => {
    return this.symbol;
  }

  GetID= () => {
    return this.cardID;
  }
}
