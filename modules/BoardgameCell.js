import { CELL_TYPE } from './Constants.js'


const CELL_TYPE_LINKS = {
  [CELL_TYPE.CORNER] : [false,true,true,false],
  [CELL_TYPE.JUNCTION] : [false,true,true,true],
  [CELL_TYPE.LINE] : [false,true,false,true]
}

let currentCardCount = 0

export default class BoardGameCell extends PIXI.Container {

  constructor(celltype,cellassetpath,symbol,rotation,canMove){

    //super(Math.random() > 0.9 ? PIXI.Texture.from(CELL_IMAGES_FANCY[celltype]) : PIXI.Texture.from(CELL_IMAGES[celltype]))
    super()
    this._cellSpriteBackground = new PIXI.Sprite.from(cellassetpath)

    // Adding the cell tile background
    this._cellSpriteBackground.anchor.set(0.5,0.5)
    this.addChild(this._cellSpriteBackground);

    // If there is a symbol, lets add it
    if(symbol != null && symbol.path != null) {

      // Adding a background here to make it stand out more
      this._symbolBackground = new PIXI.Graphics()
      this._symbolBackground.lineStyle(7, 0x98fc03, 1); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
      this._symbolBackground.beginFill(0xdddddd, 1);
      this._symbolBackground.drawCircle(this._cellSpriteBackground.x, this._cellSpriteBackground.y, 25);
      this._symbolBackground.endFill();
      this._symbolBackground.alpha = 0.8;
      this.addChild(this._symbolBackground);

      // And now we add the actual symbol onto the cell
      //onsole.log('Creating cell with symbol',symbol.path)
      this._cellSpriteSymbol = new PIXI.Sprite.from(symbol.path)
      this._cellSpriteSymbol.anchor.set(0.5,0.5);
      this._cellSpriteSymbol.alpha = 1
      this._cellSpriteSymbol.width = 58;
      this._cellSpriteSymbol.height = 58;
      this.addChild(this._cellSpriteSymbol);

    }

    this.celltype   = celltype;

    this.SafeRotate(rotation);

    //this.rotation   = rotation;
    this.symbol     = symbol;
    this.canMove    = canMove;
    this.players    = [];
    this.links      = [...CELL_TYPE_LINKS[celltype]]; // Copy the link array for the cell
    this.cardID     = currentCardCount++;
    this.row        = 0;
    this.index      = 0

  }

  SafeRotate = (rotate) => {
    this.rotation += (rotate * (Math.PI/180)) % (2*Math.PI);
    let diffRotate = (Math.PI*2) - this.rotation
    if(this._cellSpriteSymbol!=null) this._cellSpriteSymbol.rotation = diffRotate;
  }

  SetSafeRotate = (rotate) => {
    this.rotation = (rotate * (Math.PI/180)) % (2*Math.PI);
    let diffRotate = (Math.PI*2) - this.rotation
    if(this._cellSpriteSymbol!=null) this._cellSpriteSymbol.rotation = diffRotate;
  }

  CanMove = () => {
    return this.canMove;
  }

  GetLinks = () => {
    let og = CELL_TYPE_LINKS[this.celltype]
    let currentRotation = Math.floor(((this.rotation * (180/Math.PI)) / 90) % 4)
    //console.log("Current rotation is",currentRotation)
    //console.log("Getting Links",this.rotation,og,currentRotation);
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

  HideSymbol = () => {
    this._cellSpriteSymbol.visible = false;
    this._symbolBackground.visible = false;
  }
}
