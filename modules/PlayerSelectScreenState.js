// Library file imports
import BaseState from './libs/state/BaseState.js'
import { SequenceAction, ParallelAction } from './libs/action/Action.js'
import { ActionCustom } from './libs/action/ActionCustom.js'
import { ActionTween } from './libs/action/ActionTween.js'
import { Tween } from './libs/tween/Tween.js'

// Custom file imports
import MainGameSetupState from './MainGameSetupState.js'

export default class PlayerSelectScreenState extends BaseState {

  constructor(entity){
    super(entity);

    this._actionManager = new SequenceAction();
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

  Update = (delta) => {
    if(this._actionManager!=null){this._actionManager.Update(delta)};
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

    container.addChild(richText);

    // Create the choose player buttons
    playerChoiceSprites.map((object,index) => {

      object.x = 750 + index * 200; //this._entity.x + index * 150;
      object.y = 550;

      object.interactive  = true;
      object.buttonMode   = true;

      let am = this._actionManager;
      let state = this

      object.once('pointerdown',() => {
        this._entity.SetPlayerCount(index + 2);

        am.AddActions([
          new ParallelAction([
            new ActionTween(container,"alpha",Tween.easeInOutQuad, 1, 0, 800),
            new ActionTween(container,"y",Tween.easeInOutQuad, container.y, container.y - 100, 800),
          ]),
          new ActionCustom(()=>{
            state._entity.removeChild(container);
            state._entity.ChangeState(new MainGameSetupState(this._entity))
          })
        ])
      })

      container.addChild(object);

    });

    this._entity.addChild(container)
  }

  GetStateName(){
    return "Player Select State";
  }
}
