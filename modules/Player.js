import Card from './Card.js'

export default class Player {

  constructor(texture,playerNumber,house,currentCell){
    this.playerNumber = playerNumber;
    this.house        = house;
    this.currentCell  = currentCell;
    this.cards        = []

  }

  DealCard = (card) => {
    this.cards.push(card);
  }

  GetHouse = () => {
    return this.house;
  }

  GetCurrentCell = () => {
    return this.currentCell;
  }

  GetPlayerNumber = () => {
    return this.playerNumber;
  }
}
