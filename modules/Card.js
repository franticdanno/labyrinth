export default class Card extends PIXI.Sprite {

  constructor(texture,character){
    super(PIXI.Texture.from('./assets/start_game_icon.png'))

    this.character = character;
  }

}
