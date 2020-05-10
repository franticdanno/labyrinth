// ------------------------------
// This is the base state class which all state classes should extend from
// ------------------------------
export default class BaseState {
  constructor(entity){
    this._entity = entity;
  }

  Enter(){ console.log("State Enter:",this.GetStateName()) };

  Update(delta){ //console.log("Base State Update",this._entity)
  };

  Exit(){ console.log("State Exit:",this.GetStateName()) };

  GetStateName(){
    return "Base State";
  }

}
