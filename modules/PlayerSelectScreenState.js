import BaseState from './BaseState.js'
import MainGameSetupState from './MainGameSetupState.js'

export default class PlayerSelectScreenState extends BaseState {

  constructor(entity){
    super(entity);
  }

  Enter = () => {
    const container = new PIXI.Container();

    const playerChoiceSprites = [
      new PIXI.Sprite.from('./assets/start_game_icon.png'),
      new PIXI.Sprite.from('./assets/start_game_icon.png'),
      new PIXI.Sprite.from('./assets/start_game_icon.png'),
      new PIXI.Sprite.from('./assets/start_game_icon.png')
    ]

    // Create the choose player buttons
    playerChoiceSprites.map((object,index) => {

      object.scale.x = object.scale.y = 0.5;
      object.anchor.set(0.5);
      object.x = 120 + index * 150;
      object.y = 100;

      object.interactive  = true;
      object.buttonMode   = true;

      object.on('pointerdown',() => {
        console.log("pointer down")
        this._entity.removeChild(container);
        this._entity.SetPlayerCount(index + 1);
        this._entity.ChangeState(new MainGameSetupState(this._entity));
      })

      container.addChild(object);

    });

    this._entity.addChild(container)
  }

  GetStateName(){
    return "Player Select State";
  }
}
