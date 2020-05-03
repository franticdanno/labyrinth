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

export class ParallelAction extends CompositeAction {

  constructor(actions){
    super();
    this._actions = actions;
  }

  Update = (delta) => {

    // Update all actions
    this._actions.forEach((item, i) => {
      item.Update(delta);
    });

    // Remove any actions that are finished
    this._actions = this._actions.filter((action,i,a)=>{
        return action._isFinished == false;
    })

    if(this._actions.length == 0){
      this._isFinished = true; // Only finished if all actions are finished
    }
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
