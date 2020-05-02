import { SYMBOLS } from './Constants.js'

export default class Card extends PIXI.Container {

  constructor(symbol){
    super()

    this._iconSprite = null;
    this._frontContainer = null;
    this._backContainer = null;

    this._symbol     = symbol;
    this._isShowing  = false;

    this.InitialiseCard();
    this.ShowCard();

    this.interactive = true;
    this.buttonmode = true;

    let card = this
    this.on("pointerdown", () => {
      card.ToggleShow();
    })
  }

  GetSymbol = () => {
    return this._symbol;
  }

  ToggleShow = () => {
    if(this._isShowing){
      this.HideCard();
    } else {
      this.ShowCard();
    }
  }

  ShowCard = () =>{

    this._isShowing = true;
    this.addChild(this._frontContainer)
    if(this._backContainer.parent != null) this.removeChild(this._backContainer)

  }

  HideCard = () => {
    this._isShowing = false;
    this.addChild(this._backContainer)
    if(this._frontContainer.parent != null) this.removeChild(this._frontContainer)
  }

  InitialiseCard = () => {
    if(this._frontContainer == null){

      // Lets draw the front side
      this._frontContainer = new PIXI.Container()

      // Lets draw the card background
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(5, 0xFFFFFF, 1);
      graphics.beginFill(0xAA4F08);
      graphics.drawRoundedRect(this.x - 64, this.y - 70, 128, 140);
      graphics.endFill();
      this._frontContainer.addChild(graphics)

      // Now add the icon on top
      let frontSprite = PIXI.Sprite.from(this._symbol.path)
      frontSprite.height = 128;
      frontSprite.width = 128;
      frontSprite.anchor.set(0.5,0.5);
      this._frontContainer.addChild(frontSprite);

      //this.addChild(this._frontContainer)
    }

    // Now set up the back of the card
    if(this._backContainer == null){
      // Lets draw the front side
      this._backContainer = new PIXI.Container()

      // Lets draw the card background
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(5, 0xFFFFFF, 1);
      graphics.beginFill(0x522b0c);
      graphics.drawRoundedRect(this.x - 64, this.y - 70, 128, 140);
      graphics.endFill();
      this._backContainer.addChild(graphics)

      //this.addChild(this._backContainer)
    }


  }

}
