// Library imports
import { SequenceAction,ParallelAction } from './libs/action/Action.js'
import { ActionCustom } from './libs/action/ActionCustom.js'
import { ActionSleep } from './libs/action/ActionSleep.js'
import { ActionTween } from './libs/action/ActionTween.js'
import { Tween } from './libs/tween/Tween.js'

import StateManager from './libs/state/StateManager.js'

// Custom file imports
import { PLAYERS, SYMBOLS } from './Constants.js'
import Card from './Card.js';
import BoardGame from './Boardgame.js';
import Player from './Player.js'
import LoadingScreenState from './LoadingScreenState.js'

export default class Game extends PIXI.Container {

  constructor(app){
    super();

    this._settings      = {};
    this._players       = [];
    this._currentPlayer = 0
    this._app           = app;

    // State manager set up
    this._stateManager = new StateManager();
    this._actionManager = new SequenceAction();
  }

  GetTitleContainer = (customText,colour,icon) => {
    const container = new PIXI.Container();

    const graphics = new PIXI.Graphics();
    graphics.beginFill(colour);
    graphics.drawRect(0, 1080 / 2 - 50,1920 , 130);
    graphics.endFill();
    container.addChild(graphics);

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 74,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#DDDDDD'],
        //fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 8,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 1920,
    });

    let text = new PIXI.Text(customText, style);
    text.x = 1920 / 2 - text.width/2
    text.y = 500

    container.addChild(text);

    if(icon != null){
      let joystickSprite = PIXI.Sprite.from(icon)
      joystickSprite.anchor.set(0.5,0.5);
      joystickSprite.y = 550;
      joystickSprite.x = text.x - 100;
      joystickSprite.scale.x = 0.5;
      joystickSprite.scale.y = 0.5;
      container.addChild(joystickSprite);
    }

    container.alpha = 0;

    return container;


  }

  GetPlayerTitleSequence = (customText,colour) => {

    let container = this.GetTitleContainer(customText,colour,'/assets/joystick.png');
    let gameContainer = this;
    gameContainer.addChild(container);

    let titleActions = [
      new ParallelAction([
        new ActionTween(container,"alpha",Tween.linear,0,1,500),
        new ActionTween(container,"y",Tween.easeOutBounce,container.y - 200,container.y,500)
      ]),
      new ActionSleep(1500),
      new ParallelAction([
        new ActionTween(container,"alpha",Tween.linear,1,0,300),
        new ActionTween(container,"y",Tween.easeInQuad,container.y,container.y + 200,300)
      ]),
      new ActionCustom(()=>{
        gameContainer.removeChild(container);
      })
    ]

    return titleActions

  }

  GetGeneralTitleSequence = (customText,colour) => {

    let container = this.GetTitleContainer(customText,colour);
    let gameContainer = this;
    gameContainer.addChild(container);

    let titleActions = [
      new ActionTween(container,"alpha",Tween.linear,0,1,500),
      new ActionSleep(1500),
      new ParallelAction([
        new ActionTween(container,"alpha",Tween.linear,1,0,300),
        new ActionTween(container,"y",Tween.easeInQuad,container.y,container.y + 200,300)
      ]),
      new ActionCustom(()=>{
        gameContainer.removeChild(container);
      })
    ]

    return titleActions

  }

  GetApp = () => {
    return this._app;
  }

  Start = () => {
    console.log("Starting Loading state!")
    this.ChangeState(new LoadingScreenState(this));
  }

  ChangeState = (state) => {
    this._stateManager.ChangeState(state);
  }

  SetPlayerCount = (count) => {
    this._settings.playerCount = count;
  }

  GetPlayerCount = () => {
    return this._settings.playerCount;
  }

  NextPlayer = () =>{
    this._currentPlayer = (this._currentPlayer + 1) % this._players.length;
    console.log("Player turn:",this._currentPlayer);
  }

  SetUpAndShuffleCards = () => {

    // First, create the cards
    let cards = []
    for(let i = 0; i < SYMBOLS.length; i++)
    {
      let newCard = new Card(SYMBOLS[i])
      cards.push(newCard)
      //this._entity.addChild(newCard)
    }

    // Now lets 'shuffle' them
    for (let i = cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    //console.log("Shuffled all cards of length",cards.length)

    return cards;
  }

  SetPlayerFoundCard = (player,card) => {
    player.ConsumeCardTarget();
    this.removeChild(card);
    if(player.GetCardTarget() != null) player.GetCardTarget().ShowCard();
  }

  SetUpPlayers = () => {

    const numOfPlayers = this.GetPlayerCount();
    console.log("Setting up",numOfPlayers,"number of players");

    // Set up the players
    for (let i = 0; i < numOfPlayers; i++){

      let player = new Player(null,i,(()=>{
          switch(i){
            case 0: return PLAYERS.PLAYER_ONE;
            case 1: return PLAYERS.PLAYER_TWO;
            case 2: return PLAYERS.PLAYER_THREE;
            default: return PLAYERS.PLAYER_FOUR;
          }
      })(i), (()=>{
          switch(i){
            case 0: return this.GetBoardgame().GetBoardCells()[0][0];
            case 1: return this.GetBoardgame().GetBoardCells()[0][6];
            case 2: return this.GetBoardgame().GetBoardCells()[6][0];
            default: return this.GetBoardgame().GetBoardCells()[6][6];
          }
      })(i))



      this._players.push(player);
    }
  }

  GetPlayers = () => {
    return this._players;
  }

  DealCards = () => {

    let possibleCards = this.SetUpAndShuffleCards(); // Lets get all of the possible cards first

    //console.log("Number of cards:",possibleCards.length)

    let currentPlayerIndex = 0;
    while(possibleCards.length > 0){

      let chosenIndex = Math.floor(Math.random() * possibleCards.length);
      let card = possibleCards[chosenIndex];

      possibleCards.splice(chosenIndex,1)

      this._players[currentPlayerIndex].DealCard(card);

      let game = this
      card.on("pointerdown", () => {

        let symbolCell = this._boardgame.FindCellBySymbol(card.GetSymbol())
        symbolCell.HideSymbol();

        game.SetPlayerFoundCard(this._players[currentPlayerIndex],card)
      })

      currentPlayerIndex = (currentPlayerIndex + 1) % this.GetPlayerCount();
    }

    //console.log("Cards have been dealt out. Cards remaining:", possibleCards.length);
  }

  ShowPlayerCards = () => {

    const playerCardPositions = [[105,190],[1817,190],[105,875],[1817,875]]

    let players = this._players;

    for(let playerIndex = 0; playerIndex < players.length; playerIndex++) {
      let cards = players[playerIndex].GetCards();
      for(let cardIndex = 0; cardIndex < cards.length; cardIndex++){
        let card = cards[cardIndex]
        let x = playerIndex % 2 == 0 ? playerCardPositions[playerIndex][0] + ((cardIndex / cards.length) * 180) : playerCardPositions[playerIndex][0] - ((cardIndex / cards.length) * 180)
        card.x = x;
        card.y = playerCardPositions[playerIndex][1]

        // Set up whether or not it should be shown
        cardIndex == cards.length - 1 ? card.ShowCard() : card.HideCard();

        this.addChild(card);
      }
    }
  }

  SetCurrentPlayer = (playerNumber) => {
    this._currentPlayer = playerNumber - 1;
  }

  GetCurrentPlayer = () => {
    return this._players[this._currentPlayer];
  }

  GetCurrentPlayerIndex = () => {
    return this._currentPlayer;
  }

  SetUpBoardgame = () => {
    this._boardgame = new BoardGame(this);
    this._boardgame.Setup();
    this.addChild(this._boardgame);
  }

  GetBoardgame = () => {
    return this._boardgame;
  }

}
