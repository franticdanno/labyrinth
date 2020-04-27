// ------------------------------
// This is the base state class which all state classes should extend from
// ------------------------------
export default class StateManager {

  constructor(entity){
    this._currentState  = null;
    this._entity        = entity;

    // Create the update loop
    this._ticker        = new PIXI.Ticker();
    this._ticker.add(this.Update);
    this._ticker.start();
  }

  Update = (delta) => {
    //console.log("Update",this._currentState)
    if(this._currentState != null) this._currentState.Update(delta)
  }

  ChangeState = (newState) => {
    //console.log("Changing State",newState);
    if(this._currentState) this._currentState.Exit();
    this._currentState = newState;
    newState.Enter();
  }

}
