import Game from './modules/Game.js'

class MyApplication extends PIXI.Application {

  _game = null;

  constructor(initObject){
    super(initObject);

    document.body.appendChild(this.view)

    /*function resize() {
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
        app.view.style.width = w + 'px';
        app.view.style.height = h + 'px';
    }

    window.onresize = function (event) {
        resize();
    };*/
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
