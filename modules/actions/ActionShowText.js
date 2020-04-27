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

    const richText = new PIXI.Text(this._text, new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // Gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
    }));
    richText.position.x = 150 + Math.random() * 100;
    richText.position.y = 250  + Math.random() * 50;

    return richText;

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
        //console.log(delta,this._text.alpha);
        if(this._text.alpha >= 2){
          this._state = 2;
        }
        break;
      case 2:
        this._container.removeChild(this._text)
        this._isFinished = true;
    }

  }

}
