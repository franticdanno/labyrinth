import Game from './modules/Game.js'

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

class MyApplication extends PIXI.Application {

  _game = null;

  constructor(initObject){
    super(initObject);

    document.body.appendChild(this.view)

  }

  Resize = () => {
    console.log("Resizing");
    var ratio = CANVAS_WIDTH / CANVAS_HEIGHT;
    var w;
    var h;
    if (window.innerWidth / window.innerHeight >= ratio) {
        w = window.innerHeight * ratio;
        h = window.innerHeight;
    } else {
        w = window.innerWidth;
        h = window.innerWidth / ratio;
    }
    this.view.style.width = w + 'px';
    this.view.style.height = h + 'px';
  }

  Start = () => {
    this._game = new Game();
    this.stage.addChild(this._game);
    this._game.Start();
  }
}


// Start the application
const myApplication = new MyApplication({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor : 0x0c6e20,
  antialias : true
})

myApplication.Resize();
myApplication.Start();

window.onresize = function (event) {
    console.log(event);
    myApplication.Resize();
};
