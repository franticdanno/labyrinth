// Library file imports
import BaseState from './libs/state/BaseState.js'

// Custom file imports
import MainGameSetupState from './MainGameSetupState.js'

export default class PlayerSelectScreenState extends BaseState {

  constructor(entity){
    super(entity);
  }

  GetPlayerIcon = (index) => {
    let container = new PIXI.Container();

    // Create the rectangle
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(10, 0x000000, 1);
    graphics.beginFill(0xffffff);
    graphics.drawRoundedRect(-64, -64, 128, 128);
    graphics.endFill();
    graphics.alpha = 0.4;

    container.addChild(graphics)

    const basicText = new PIXI.Text('' + index,{fontFamily : 'Arial', fontSize: 80, fill : 0x000000, align : 'center'});
    basicText.x = -18;
    basicText.y = -42;
    container.addChild(basicText);

    // Create the number

    return container

  }

  Enter = () => {
    const container = new PIXI.Container();

    const playerChoiceSprites = [
      //new PIXI.Sprite.from('./assets/start_game_icon.png'),
      this.GetPlayerIcon(2),
      this.GetPlayerIcon(3),
      this.GetPlayerIcon(4)
    ]

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 60,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 800,
    });

    const richText = new PIXI.Text('How many players?', style);
    richText.x = 680;
    richText.y = 380;

    this._entity.addChild(richText);

    // Create the choose player buttons
    playerChoiceSprites.map((object,index) => {

      object.x = 750 + index * 200; //this._entity.x + index * 150;
      object.y = 550;

      object.interactive  = true;
      object.buttonMode   = true;

      object.on('pointerdown',() => {
        console.log("pointer down")
        this._entity.removeChild(container);
        this._entity.SetPlayerCount(index + 2);
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
