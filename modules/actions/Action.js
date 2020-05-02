export class Action {

  constructor(){
    this._isFinished  = false;
  }

  Update       = (delta) => {}
}

export class CompositeAction extends Action {

  constructor(){
    super();
    this._actions = []
  }

  AddAction(action){
    //console.log("Adding action", action);
    this._actions.push(action);
    return this;
  }

}

/* export class ConditionalAction extends Action {
  constructor(fCondition,params,Action1,Action2){
      super();

      this._fCondition = fCondition;
      this._params = params;
      this._action1 = Action1;
      this._action2 = Action2;
  }

  Update = (delta) => {
    if(fCondition(params)){
      AddAction(this._action1);
    } else {
      AddAction(this._action2);
    }

    this._isFinished = true;
  }

} */

export class ParallelAction extends CompositeAction {

  constructor(){
    super();
  }

  Update = (delta) => {

    // Update all actions
    this._actions.forEach((item, i) => {
      item.Update(delta);
    });

    // Remove any actions that are finished
    this._actions = this._actions.filter((action)=>{
        return action._isFinished == true;
    })

    this._isFinished = (this._actions.length == 0); // Only finished if all actions are finished

  }
}

export class SequenceAction extends CompositeAction {

  constructor(){
    super();
  }

  Update = (delta) => {

    if(this._actions.length > 0){

      if(this._actions[0]._isFinished){
        //console.log("Finished?",this._actions[0]._isFinished);
        this._actions.shift()
      } else {
        this._actions[0].Update(delta);
      }

    }

    // This action is only finished if the length is now 0
    this._isFinished = this._actions.length == 0;
  }
}
