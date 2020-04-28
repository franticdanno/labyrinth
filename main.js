import Game from './modules/Game.js'

let canvas_width = 800;
let canvas_height = 600;

class MyApplication extends PIXI.Application {

  _game = null;

  constructor(initObject){
    super(initObject);

    document.body.appendChild(this.view)

  }

  Resize = () => {
    console.log("Resizing");
    var ratio = canvas_width / canvas_height;
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
  width           : canvas_width,
  height          : canvas_height,
  backgroundColor : 0x1099bb
})
myApplication.Start();

window.onresize = function (event) {
    console.log(event);
    myApplication.Resize();
};
