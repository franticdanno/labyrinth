import BaseState from './BaseState.js'
import PlayerSelectScreenState from './PlayerSelectScreenState.js'

export default class LoadingScreenState extends BaseState {

  constructor(entity){
    super(entity);
  }

  Enter = () => {
    const loadingText = new PIXI.Text('Loading', new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 100,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
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
    loadingText.x = 700;
    loadingText.y = 250;

    // Show Loading text
    this._entity.addChild(loadingText);

    // Start Loading assets for the application
    const loader = PIXI.Loader.shared;
    loader.add("assets/")
    loader.add("assets/boardgame_spritesheet.json")
    loader.add("assets/board_background.png")

    //loader.onProgress.add((e)=>( console.log("progressing...",e)) )
    loader.onComplete.add((e)=>{
        console.log("Loading completed...")
        this._entity.removeChild(loadingText) // Remove loading
        this._entity.ChangeState(new PlayerSelectScreenState(this._entity))
    });
    loader.load();
  }

  GetStateName(){
    return "Loading Screen State";
  }
}
