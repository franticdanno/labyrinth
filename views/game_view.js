const playerSelect = {
  Sprite: {
    id: './assets/start_game_icon.png',
    pos: {
      x : 100,
      y : 100
    },
    scale : {
      x : 0.5,
      y : 0.5
    },
    anchor : 0.5,
    buttonMode : true,
    isInteractive : true
  }
}

function ContainerLoader(pixi){

  this.buildSprite(object){

    let returnSprite = new PIXI.Sprite.from(object.id);

    if(object.pos){
      returnSprite.x = object.pos.x;
      returnSprite.y = object.pos.y;
    }

    if(object.scale){
      returnSprite.x = object.scale.x;
      returnSprite.y = object.scale.y;
    }

    object.interactive ? returnSprite.interactive = true : returnSprite.interactive = false;
    object.buttonMode ? returnSprite.buttonMode = true : returnSprite.buttonMode = false;

    return returnSprite;

  }

  this.LoadContainer(json){

    let container = new PIXI.Container();

    json.map((value,key) => {
        switch(key){
          case "Container" :
            container.addChild(this.LoadContainer(value))
          case "Sprite" :
            container.addChild(this.buildSprite(value))
        }
    }
    return container;

  }
}
