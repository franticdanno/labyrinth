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

  GetCards = () => {
    return this.cards;
  }

  GetHouse = () => {
    return this.house;
  }

  GetCurrentCell = () => {
    return this.currentCell;
  }

  SetCurrentCell = (cell) => {
    this.currentCell = cell
  }

  GetPlayerNumber = () => {
    return this.playerNumber;
  }

  GetCardTarget = () => {
    return this.cards[this.cards.length - 1]
  }

  ConsumeCardTarget = () => {
    this.cards.pop(); // Remove the last card from the getArrayOfPossibleCells
  }

  GetContainerRef = () => {
    return this._containerRef;
  }

  SetContainerRef = (container) => {
    this._containerRef = container;
  }

}
