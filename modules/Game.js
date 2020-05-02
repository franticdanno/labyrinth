import { HOUSE, CHARACTER, SYMBOLS, CELL_TYPE } from './Constants.js'
import Card from './Card.js';
import BoardGame from './Boardgame.js';
import Player from './Player.js'
import BaseState from './BaseState.js'
import StateManager from './StateManager.js'
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

    console.log("Shuffled all cards of length",cards.length)

    return cards;
  }

  SetPlayerFoundCard = (player,card) => {
    player.ConsumeCardTarget();
    this.removeChild(card);
    player.GetCardTarget().ShowCard();
  }

  SetUpPlayers = () => {

    const numOfPlayers = this.GetPlayerCount();
    console.log("Setting up",numOfPlayers,"number of players");

    // Set up the players
    for (let i = 0; i < numOfPlayers; i++){

      let player = new Player(null,i,(()=>{
          switch(i){
            case 0: return HOUSE.GRYFFINDOR;
            case 1: return HOUSE.SLYTHERIN;
            case 2: return HOUSE.HUFFLEPUFF;
            default: return HOUSE.RAVENCLAW;
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

  DealCards = () => {

    let possibleCards = this.SetUpAndShuffleCards(); // Lets get all of the possible cards first

    console.log("Number of cards:",possibleCards.length)

    let currentPlayerIndex = 0;
    while(possibleCards.length > 0){

      let chosenIndex = Math.floor(Math.random() * possibleCards.length);
      let card = possibleCards[chosenIndex];

      possibleCards.splice(chosenIndex,1)

      this._players[currentPlayerIndex].DealCard(card);

      currentPlayerIndex = (currentPlayerIndex + 1) % this.GetPlayerCount();
    }

    console.log("Cards have been dealt out. Cards remaining:", possibleCards.length);
  }


  ShowPlayerCards = () => {

    const playerCardPositions = [[200,200],[1720,200],[200,880],[1720,880]]

    let players = this._players;

    for(let playerIndex = 0; playerIndex < players.length; playerIndex++) {
      let cards = players[playerIndex].GetCards();
      for(let cardIndex = 0; cardIndex < cards.length; cardIndex++){
        let card = cards[cardIndex]
        let x = playerIndex % 2 == 0 ? playerCardPositions[playerIndex][0] + ((cardIndex / cards.length) * 120) : playerCardPositions[playerIndex][0] - ((cardIndex / cards.length) * 120)
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
