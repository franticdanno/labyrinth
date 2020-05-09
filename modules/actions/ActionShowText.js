import { Action } from './Action.js'

export class ActionShowText extends Action {

  constructor(container,text,time){
    super();
    this._container = container;
    this._state = 0; // 0 = setup, 1 = show text, 2 = hide text
    this._text = text || "Default Text";
    this._totalTime = 0
  }

  getText = () => {

    const container = new PIXI.Container();

    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xDE3249);
    graphics.drawRect(0, 1080 / 2 - 50,1920 , 130);
    graphics.endFill();
    container.addChild(graphics);

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 74,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#DDDDDD'],
        //fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 8,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 1920,
    });

    let text = new PIXI.Text(this._text, style);
    text.x = 1920 / 2 - text.width/2
    text.y = 500

    container.addChild(text);
    return container;
  }

  Update = (delta) => {

    this._totalTime += delta;

    switch(this._state){
      case 0:
        this._text = this.getText();
        this._text.alpha = 0;
        this._container.addChild(this._text);
        this._state = 1;
        break;
      case 1:
        this._text.alpha += this._totalTime / 2000 ;
        if(this._text.alpha >= 2){
          this._state = 2;
          this._totalTime = 0;
        }
        break;
      case 2:
        if(this._totalTime >= 10){
          this._state = 3;
        }
        break;
      case 3:
        this._container.removeChild(this._text)
        this._isFinished = true;
        break;
    }

  }

}
