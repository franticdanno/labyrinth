import Game from './modules/Game.js'

class MyApplication extends PIXI.Application {

  _game = null;

  constructor(initObject){
    super(initObject);

    document.body.appendChild(this.view)
  }

  Start = () => {
    this._game = new Game();
    this.stage.addChild(this._game);
    this._game.Start();
  }
}

// Start the application
const myApplication = new MyApplication({
  width           : 800,
  height          : 600,
  backgroundColor : 0x1099bb
}).Start();
